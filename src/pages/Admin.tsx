import { useEffect, useState } from 'react'
import { subscribe } from '../state/auth'
import { collection, doc, getDocs, query, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { setTAE } from '../services/firestore'
import { t } from '../state/i18n'

export default function Admin() {
  const [tae, setTaeVal] = useState<number>(2.5)
  const [users, setUsers] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [filterEmail, setFilterEmail] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all'|'user'|'admin'>('all')

  useEffect(() => {
    return subscribe(async s => {
      if (s.role !== 'admin') return
      const qs = await getDocs(query(collection(db, 'users')))
      setUsers(qs.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [])

  async function saveTAE() { setMsg(''); await setTAE('', tae); setMsg(t('tae_saved')) }
  async function freeze(uid: string, frozen: boolean) { setMsg(''); await setDoc(doc(db, 'accounts', uid), { frozen }, { merge:true }); setMsg(t('updated')) }
  async function promote(uid: string) { setMsg(''); await setDoc(doc(db, 'users', uid), { role: 'admin' }, { merge:true }); setMsg(t('promoted')) }

  return (
    <div className="container" style={{ maxWidth:1000 }}>
      <div className="card" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
      <div>
        <h2>{t('nav_admin')}</h2>
        <h3>{t('investments_tae')}</h3>
        <input type="number" value={tae} onChange={e=>setTaeVal(Number(e.target.value))} />
        <div className="actions" style={{ marginTop:8 }}><button onClick={saveTAE}>{t('settings_save')}</button></div>
      </div>
      <div>
        <h3>Usuarios</h3>
        <div style={{ display:'flex', gap:8 }}>
          <input className="input" placeholder="email" value={filterEmail} onChange={e=>setFilterEmail(e.target.value)} />
          <select className="input" value={roleFilter} onChange={e=>setRoleFilter(e.target.value as any)}>
            <option value="all">todos</option>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>
      </div>
      </div>
      <div className="card" style={{ marginTop:16 }}>
       <table style={{ width:'100%', borderCollapse:'collapse' }}>
         <thead>
           <tr><th>{t('profile_email')}</th><th>{t('profile_user')}</th><th>{t('profile_role')}</th><th>{t('actions_label')}</th></tr>
         </thead>
        <tbody>
          {users.filter(u => (roleFilter==='all' || u.role===roleFilter) && (!filterEmail || String(u.email).includes(filterEmail))).map(u => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td style={{ display:'flex', gap:8 }}>
                <button onClick={()=>freeze(u.id, true)}>{t('admin_block')}</button>
                <button onClick={()=>freeze(u.id, false)}>{t('admin_unblock')}</button>
                <button onClick={()=>promote(u.id)}>{t('admin_promote')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {msg && <p>{msg}</p>}
      </div>
    </div>
  )
}
