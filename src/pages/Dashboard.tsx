import { useEffect, useState } from 'react'
import { subscribe } from '../state/auth'
import { getBalance, getAccount, transferByAccountNumber } from '../services/firestore'
import { Link } from 'react-router-dom'
import { t } from '../state/i18n'

export default function Dashboard() {
  const [uid, setUid] = useState<string>('')
  const [balance, setBalance] = useState<number>(0)
  const [accNumber, setAccNumber] = useState<string>('')
  const [toNumber, setToNumber] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [note, setNote] = useState('')
  const [msg, setMsg] = useState<string>('')

  useEffect(() => {
    return subscribe(async s => {
      if (!s.user) return
      setUid(s.user.uid)
      const b = await getBalance(s.user.uid)
      setBalance(b)
      const acc = await getAccount(s.user.uid)
      setAccNumber(String(acc?.number || ''))
    })
  }, [])

  async function doTransfer() {
    setMsg('')
    try {
      await transferByAccountNumber(uid, toNumber, amount, note)
      const b = await getBalance(uid)
      setBalance(b)
      setMsg('Transferencia realizada')
      setMsg(t('transfer_done'))
    } catch (e: any) {
      setMsg(e?.message || 'Error')
    }
  }

  return (
    <div className="container" style={{ maxWidth:1000 }}>
      <div className="card" style={{ marginTop:24, display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
        <div>
          <h2>{t('dashboard_title')}</h2>
          <p className="subtitle">{t('dashboard_balance')}</p>
          <h1 style={{ margin:'8px 0' }}>{balance.toFixed(2)} €</h1>
          <p>{t('dashboard_accnum')}</p>
          <div className="key-box"><strong>{accNumber}</strong></div>
        </div>
        <div>
          <h3>{t('transfer_title')}</h3>
          <div className="form-row"><div className="label">{t('transfer_to')}</div><input className="input" value={toNumber} onChange={e=>setToNumber(e.target.value)} /></div>
          <div className="form-row"><div className="label">{t('transfer_amount')}</div><input className="input" type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} /></div>
          <div className="form-row"><div className="label">{t('transfer_note')}</div><input className="input" value={note} onChange={e=>setNote(e.target.value)} /></div>
          <div className="actions"><button onClick={doTransfer}>{t('transfer_send')}</button></div>
          {msg && <p className="subtitle" style={{ color:'#7bd3ff' }}>{msg}</p>}
        </div>
      </div>
      <div className="grid" style={{ marginTop:24 }}>
        <Link to="/investments" className="card"><h3>{t('nav_investments')}</h3><p className="subtitle">{t('tile_investments_sub')}</p></Link>
        <Link to="/piggy" className="card"><h3>{t('nav_piggy')}</h3><p className="subtitle">{t('tile_piggy_sub')}</p></Link>
        <Link to="/history" className="card"><h3>{t('nav_history')}</h3><p className="subtitle">{t('tile_history_sub')}</p></Link>
        <Link to="/profile" className="card"><h3>{t('nav_profile')}</h3><p className="subtitle">{t('tile_profile_sub')}</p></Link>
        <Link to="/settings" className="card"><h3>{t('nav_settings')}</h3><p className="subtitle">{t('tile_settings_sub')}</p></Link>
      </div>
    </div>
  )
}
