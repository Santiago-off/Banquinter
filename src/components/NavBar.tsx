import { Link, useLocation } from 'react-router-dom'
import { subscribe, logout } from '../state/auth'
import { useEffect, useState } from 'react'
import Logo from './Logo'
import { t, setLanguage, subscribeLanguage } from '../state/i18n'

export default function NavBar() {
  const loc = useLocation()
  const [role, setRole] = useState<'user'|'admin'|null>(null)
  const [userEmail, setUserEmail] = useState<string|undefined>(undefined)
  const [lang, setLang] = useState<'es'|'en'>('es')

  useEffect(() => {
    const u = subscribe(s => { setRole(s.role); setUserEmail(s.user?.email || undefined) })
    const l = subscribeLanguage(l => setLang(l))
    return () => { u(); l() }
  }, [])

  return (
    <nav style={{ display:'flex', gap:12, padding:12, borderBottom:'1px solid #15233a', alignItems:'center' }}>
      <Link to="/" style={{ display:'flex', alignItems:'center', gap:8 }}><Logo /><span style={{ fontWeight:700 }}>{t('brand')}</span></Link>
      {!userEmail && (
        <>
          <a href="/#features" style={{ color: loc.hash==='#features'? '#0b5': '#7bd3ff' }}>{t('nav_features')}</a>
          <a href="/#about" style={{ color: loc.hash==='#about'? '#0b5': '#7bd3ff' }}>{t('nav_about')}</a>
          <a href="/#advantages" style={{ color: loc.hash==='#advantages'? '#0b5': '#7bd3ff' }}>{t('nav_advantages')}</a>
          <a href="/#subscriptions" style={{ color: loc.hash==='#subscriptions'? '#0b5': '#7bd3ff' }}>{t('nav_subscriptions')}</a>
          <a href="/#terms" style={{ color: loc.hash==='#terms'? '#0b5': '#7bd3ff' }}>{t('nav_terms')}</a>
        </>
      )}
      <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
        {userEmail ? (
          <>
            <Link to="/dashboard" style={{ color: loc.pathname==='/dashboard'? '#0b5': '#7bd3ff' }}>{t('nav_panel')}</Link>
            <Link to="/investments" style={{ color: loc.pathname==='/investments'? '#0b5': '#7bd3ff' }}>{t('nav_investments')}</Link>
            <Link to="/piggy" style={{ color: loc.pathname==='/piggy'? '#0b5': '#7bd3ff' }}>{t('nav_piggy')}</Link>
            <Link to="/history" style={{ color: loc.pathname==='/history'? '#0b5': '#7bd3ff' }}>{t('nav_history')}</Link>
            <Link to="/profile" style={{ color: loc.pathname==='/profile'? '#0b5': '#7bd3ff' }}>{t('nav_profile')}</Link>
            <Link to="/settings" style={{ color: loc.pathname==='/settings'? '#0b5': '#7bd3ff' }}>{t('nav_settings')}</Link>
            {role==='admin' && <Link to="/admin" style={{ color: loc.pathname==='/admin'? '#0b5': '#f59e0b' }}>{t('nav_admin')}</Link>}
            <span style={{ opacity:0.7 }}>{userEmail}</span>
            <button onClick={logout}>{t('logout')}</button>
          </>
        ) : (
          <>
            <Link to="/login"><button>{t('nav_login')}</button></Link>
            <Link to="/register"><button className="secondary">{t('nav_register')}</button></Link>
          </>
        )}
        <button className="secondary" onClick={()=>setLanguage(lang==='es'?'en':'es')}>{lang==='es'?'EN':'ES'}</button>
      </div>
    </nav>
  )
}
