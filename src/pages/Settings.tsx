import { useEffect, useState } from 'react'
import { subscribe } from '../state/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { randomKey, sha256Hex } from '../utils/crypto'
import { t } from '../state/i18n'

export default function Settings() {
  const [uid, setUid] = useState<string>('')
  const [username, setUsername] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    return subscribe(async s => {
      if (!s.user) return
      setUid(s.user.uid)
      const snap = await getDoc(doc(db, 'users', s.user.uid))
      setUsername(String((snap.data() as any)?.username || ''))
    })
  }, [])

  async function save() {
    setMsg('')
    await setDoc(doc(db, 'users', uid), { username }, { merge:true })
    setMsg('Guardado')
  }

  async function regenerateKey() {
    setMsg('')
    const salt = randomKey(8)
    const key = randomKey(16)
    const hash = await sha256Hex(salt + ':' + key)
    await setDoc(doc(db, 'users', uid), { bankKeySalt: salt, bankKeyHash: hash }, { merge:true })
    setMsg('Nueva clave: ' + key)
  }

  return (
    <div className="container" style={{ maxWidth:700 }}>
      <div className="card">
      <h2>{t('settings_title')}</h2>
      <div className="form-row"><div className="label">{t('settings_user')}</div><input className="input" value={username} onChange={e=>setUsername(e.target.value)} /></div>
      <div className="actions"><button onClick={save}>{t('settings_save')}</button></div>
      <h3>{t('settings_bankkey')}</h3>
      <div className="actions"><button onClick={regenerateKey}>{t('settings_regen')}</button></div>
      {msg && <p>{msg}</p>}
      </div>
    </div>
  )
}
