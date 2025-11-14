import { useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { sha256Hex } from '../utils/crypto'
import { constantTimeEqual } from '../security/constantTime'
import { canAttemptLogin, recordFailedAttempt, resetRate } from '../security/rateLimiter'
import { setVerifiedKey } from '../state/auth'
import { useNavigate } from 'react-router-dom'
import { subscribe } from '../state/auth'
import { t } from '../state/i18n'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [bankKey, setBankKey] = useState('')
  const [error, setError] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const [keyOverlay, setKeyOverlay] = useState<string|null>(null)
  const [canClose, setCanClose] = useState(false)

  useEffect(() => {
    const k = localStorage.getItem('banquinter:keyToShow')
    const shown = localStorage.getItem('banquinter:keyShown')
    if (k && !shown) {
      setKeyOverlay(k)
      localStorage.setItem('banquinter:keyShown', '1')
      setCanClose(false)
      setTimeout(() => setCanClose(true), 3000)
    }
  }, [])

  useEffect(() => {
    return subscribe(s => {
      if (s.user && s.verifiedKey) {
        if (s.role === 'admin') nav('/admin')
        else nav('/dashboard')
      }
    })
  }, [nav])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!canAttemptLogin()) { setError('Demasiados intentos. Inténtalo más tarde.'); return }
    setLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const userDoc = await getDoc(doc(db, 'users', cred.user.uid))
      const data = userDoc.data() as any
      const hash = await sha256Hex(String(data?.bankKeySalt || '') + ':' + bankKey)
      const match = constantTimeEqual(hash, String(data?.bankKeyHash || ''))
      await new Promise(r => setTimeout(r, 250 + Math.random()*250))
      if (!match) {
        recordFailedAttempt()
        setError('Clave bancaria inválida')
        return
      }
      resetRate()
      setVerifiedKey(true)
      if (String(data?.role) === 'admin') nav('/admin')
      else nav('/dashboard')
    } catch (err: any) {
      recordFailedAttempt()
      setError(err?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{t('login_title')}</h2>
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="label">{t('login_email')}</div>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className="form-row">
            <div className="label">{t('login_password')}</div>
            <div style={{ display:'flex', gap:8 }}>
              <input className="input" type={showPass ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} required />
              <button type="button" className="secondary" onClick={()=>setShowPass(s=>!s)}>{showPass ? t('login_hide') : t('login_show')}</button>
            </div>
          </div>
          <div className="form-row">
            <div className="label">{t('login_bankkey')}</div>
            <input className="input" value={bankKey} onChange={e=>setBankKey(e.target.value)} required />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="actions"><button type="submit" disabled={loading}>{loading ? '...' : t('login_submit')}</button></div>
        </form>
      </div>
      {keyOverlay && (
        <div className="overlay">
          <div className="modal">
            <h3>{t('key_once_title')}</h3>
            <p className="subtitle">{t('key_once_subtitle')}</p>
            <div className="key-box"><strong>{keyOverlay}</strong></div>
            <div className="actions" style={{ marginTop:12 }}>
              <button type="button" onClick={()=>navigator.clipboard.writeText(keyOverlay)}>{t('copy')}</button>
              <button type="button" className="secondary" disabled={!canClose} onClick={()=>{ localStorage.removeItem('banquinter:keyToShow'); setKeyOverlay(null) }}>{canClose ? t('close') : t('wait')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
