import { useState } from 'react'
import { z } from 'zod'
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { randomKey, sha256Hex, pbkdf2Hex } from '../utils/crypto'
import { generateAccountNumber } from '../utils/account'
import { useNavigate } from 'react-router-dom'
import { t } from '../state/i18n'

const schema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8)
})

export default function Register() {
  const [form, setForm] = useState({ email:'', username:'', password:'' })
  const [bankKey, setBankKey] = useState<string|null>(null)
  const [error, setError] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const [canClose, setCanClose] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const parsed = schema.safeParse(form)
    if (!parsed.success) { setError('Datos inválidos'); return }
    const key = randomKey(16)
    try {
      setLoading(true)
      const cred = await createUserWithEmailAndPassword(auth, parsed.data.email, parsed.data.password)
      await updateProfile(cred.user, { displayName: parsed.data.username })
      const salt = randomKey(8)
      const hash = await sha256Hex(salt + ':' + key)
      const pwSalt = randomKey(12)
      const pwHash = await pbkdf2Hex(parsed.data.password, pwSalt)
      await setDoc(doc(db, 'users', cred.user.uid), {
        email: parsed.data.email,
        username: parsed.data.username,
        role: 'user',
        bankKeySalt: salt,
        bankKeyHash: hash,
        passwordSalt: pwSalt,
        passwordHash: pwHash,
        passwordIterations: 120000,
        createdAt: Date.now()
      })
      await setDoc(doc(db, 'emailToUid', parsed.data.email), { uid: cred.user.uid })
      const accNumber = generateAccountNumber()
      await setDoc(doc(db, 'accounts', cred.user.uid), { balance: 0, frozen: false, number: accNumber })
      await signOut(auth)
      setBankKey(key)
      setCanClose(false)
      setTimeout(() => setCanClose(true), 3000)
    } catch (err: any) {
      setError(err?.message || 'Error al registrar')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
      <h2>{t('register_title')}</h2>
      {bankKey ? (
        <div className="overlay">
          <div className="modal">
            <h3>Tu clave bancaria única</h3>
            <p className="subtitle">Esta clave se muestra solo una vez al crear la cuenta. Guárdala ahora.</p>
            <div className="key-box"><strong>{bankKey}</strong></div>
            <div className="actions" style={{ marginTop:12 }}>
              <button type="button" onClick={()=>navigator.clipboard.writeText(bankKey || '')}>Copiar</button>
              <button type="button" className="secondary" disabled={!canClose} onClick={()=>{ setBankKey(null); nav('/login', { replace:true }) }}>{canClose ? 'Cerrar y continuar a Login' : 'Espera...'}</button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="label">{t('register_username')}</div>
            <input className="input" value={form.username} onChange={e=>setForm(f=>({ ...f, username:e.target.value }))} required />
          </div>
          <div className="form-row">
            <div className="label">{t('register_email')}</div>
            <input className="input" type="email" value={form.email} onChange={e=>setForm(f=>({ ...f, email:e.target.value }))} required />
          </div>
          <div className="form-row">
            <div className="label">{t('register_password')}</div>
            <input className="input" type="password" value={form.password} onChange={e=>setForm(f=>({ ...f, password:e.target.value }))} required />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="actions"><button type="submit" disabled={loading}>{loading ? '...' : t('register_submit')}</button></div>
        </form>
      )}
      </div>
    </div>
  )
}
