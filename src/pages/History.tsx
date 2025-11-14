import { useEffect, useState } from 'react'
import { subscribe } from '../state/auth'
import { getTransfers } from '../services/firestore'
import { t } from '../state/i18n'

export default function History() {
  const [rows, setRows] = useState<Array<any>>([])
  useEffect(() => subscribe(async s => { if (s.user) setRows(await getTransfers(s.user.uid)) }), [])
  return (
    <div className="container">
      <h2>{t('history_title')}</h2>
      <div className="card">
        {rows.length === 0 ? (
          <p className="subtitle">{t('history_empty')}</p>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr><th style={{ textAlign:'left' }}>{t('table_date')}</th><th style={{ textAlign:'left' }}>{t('table_from')}</th><th style={{ textAlign:'left' }}>{t('table_to')}</th><th style={{ textAlign:'left' }}>{t('table_amount')}</th><th style={{ textAlign:'left' }}>{t('table_note')}</th></tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.at?.toDate?.().toLocaleString?.() || ''}</td>
                  <td>{r.fromUid}</td>
                  <td>{r.toUid}</td>
                  <td>{Number(r.amount).toFixed(2)} €</td>
                  <td>{r.note || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
