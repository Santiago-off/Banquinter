import { t } from '../state/i18n'

export default function Info() {
  return (
    <div className="container" style={{ maxWidth:900 }}>
      <div className="card">
        <h2>{t('info_title')}</h2>
        <p className="subtitle">{t('info_p1')}</p>
        <p className="subtitle">{t('info_p2')}</p>
        <p className="subtitle">{t('info_p3')}</p>
      </div>
    </div>
  )
}
