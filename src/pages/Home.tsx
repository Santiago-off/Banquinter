import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { t } from '../state/i18n'

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="card">
      <div className="badge">{title}</div>
      <p className="subtitle">{desc}</p>
    </div>
  )
}

function IconCard({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>
}

export default function Home() {
  return (
    <div>
      <section className="hero fade-in">
        <div className="orbit" />
        <div className="container">
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:14, marginBottom:24 }}>
            <Logo size={48} />
            <h1>{t('home_title')}</h1>
          </div>
          <p>{t('home_subtitle')}</p>
          <div style={{ display:'flex', justifyContent:'center', gap:12, marginTop:20 }}>
            <Link to="/login"><button>{t('home_cta_login')}</button></Link>
            <Link to="/register"><button className="secondary">{t('home_cta_register')}</button></Link>
          </div>
        </div>
      </section>

      <section id="features" className="section slide-up">
        <div className="container">
          <h2>{t('nav_features')}</h2>
          <p className="subtitle">{t('features_subtitle')}</p>
          <div className="grid">
            <Feature title={t('cat_account')} desc={t('feat_account_desc')} />
            <Feature title={t('cat_investments')} desc={t('feat_investments_desc')} />
            <Feature title={t('cat_piggy')} desc={t('feat_piggy_desc')} />
            <Feature title={t('cat_security')} desc={t('feat_security_desc')} />
            <Feature title={t('cat_subs')} desc={t('feat_subs_desc')} />
            <Feature title={t('cat_support')} desc={t('feat_support_desc')} />
          </div>
        </div>
      </section>

      <section id="about" className="section slide-up">
        <div className="container">
          <h2>{t('about_title')}</h2>
          <p className="subtitle">{t('about_subtitle')}</p>
          <div className="grid" style={{ gridTemplateColumns:'1fr 1fr 1fr' }}>
            <div className="card">{t('about_card1')}</div>
            <div className="card">{t('about_card2')}</div>
            <div className="card">{t('about_card3')}</div>
          </div>
          <div className="card" style={{ marginTop:16 }}>
            <p className="subtitle">{t('about_p1')}</p>
            <p className="subtitle">{t('about_p2')}</p>
          </div>
        </div>
      </section>

      <section id="advantages" className="section slide-up">
        <div className="container">
          <h2>{t('adv_title')}</h2>
          <div className="grid">
            <div className="card">{t('adv_item1')}</div>
            <div className="card">{t('adv_item2')}</div>
            <div className="card">{t('adv_item3')}</div>
          </div>
        </div>
      </section>

      <section id="terms" className="section slide-up">
        <div className="container">
          <h2>{t('terms_title')}</h2>
          <div className="card">{t('terms_body')}</div>
        </div>
      </section>

      <section id="subscriptions" className="section slide-up">
        <div className="container">
          <h2>{t('subs_title')}</h2>
          <div className="grid">
            <div className="card">
              <h3>{t('subs_free')}</h3>
              <p className="subtitle">{t('subs_free_desc')}</p>
              <button>{t('choose')}</button>
            </div>
            <div className="card">
              <h3>{t('subs_premium')}</h3>
              <p className="subtitle">{t('subs_premium_desc')}</p>
              <button>{t('choose')}</button>
            </div>
            <div className="card">
              <h3>{t('subs_business')}</h3>
              <p className="subtitle">{t('subs_business_desc')}</p>
              <button>{t('choose')}</button>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="section slide-up">
        <div className="container">
          <h2>{t('images')}</h2>
          <div className="gallery">
            <IconCard><svg viewBox="0 0 120 80"><rect x="8" y="8" width="104" height="64" rx="10" fill="#123"/><circle cx="40" cy="40" r="18" fill="#0ea5e9"/><rect x="64" y="28" width="40" height="8" rx="4" fill="#22c55e"/><rect x="64" y="44" width="40" height="8" rx="4" fill="#1b9e5a"/></svg></IconCard>
            <IconCard><svg viewBox="0 0 120 80"><rect x="12" y="12" width="96" height="56" rx="12" fill="#123"/><path d="M24 56 L48 32 L68 52 L96 24" stroke="#0ea5e9" strokeWidth="4" fill="none"/></svg></IconCard>
            <IconCard><svg viewBox="0 0 120 80"><rect x="10" y="18" width="100" height="50" rx="8" fill="#123"/><circle cx="40" cy="42" r="8" fill="#22c55e"/><circle cx="60" cy="42" r="8" fill="#0ea5e9"/><circle cx="80" cy="42" r="8" fill="#1b9e5a"/></svg></IconCard>
            <IconCard><svg viewBox="0 0 120 80"><rect x="8" y="8" width="104" height="64" rx="10" fill="#123"/><rect x="20" y="24" width="80" height="12" rx="6" fill="#0ea5e9"/><rect x="20" y="44" width="56" height="12" rx="6" fill="#22c55e"/></svg></IconCard>
          </div>
        </div>
      </section>

      <footer className="footer">© {t('brand')}</footer>
    </div>
  )
}
