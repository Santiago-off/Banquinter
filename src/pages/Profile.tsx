import { useEffect, useState } from 'react'
import { subscribe } from '../state/auth'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { t } from '../state/i18n'

export default function Profile() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('user')
  useEffect(() => {
    return subscribe(async s => {
      if (!s.user) return
      const snap = await getDoc(doc(db, 'users', s.user.uid))
      const d = snap.data() as any
      setEmail(String(d?.email || s.user.email || ''))
      setUsername(String(d?.username || ''))
      setRole(String(d?.role || 'user'))
    })
  }, [])
  return (
    <div className="container">
      <h2>{t('profile_title')}</h2>
      <div className="card" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
        <div>
          <p className="subtitle">{t('profile_email')}</p>
          <h3>{email}</h3>
        </div>
        <div>
          <p className="subtitle">{t('profile_user')}</p>
          <h3>{username}</h3>
        </div>
        <div>
          <p className="subtitle">{t('profile_role')}</p>
          <h3>{role}</h3>
        </div>
      </div>
    </div>
  )
}
