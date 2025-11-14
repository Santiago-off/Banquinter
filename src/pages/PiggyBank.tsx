import { useEffect, useState } from 'react'
import { subscribe } from '../state/auth'
import { depositToPiggy, withdrawFromPiggy, getBalance } from '../services/firestore'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { t } from '../state/i18n'

export default function PiggyBank() {
  const [uid, setUid] = useState<string>('')
  const [accBalance, setAccBalance] = useState<number>(0)
  const [pigBalance, setPigBalance] = useState<number>(0)
  const [amount, setAmount] = useState<number>(0)
  const [msg, setMsg] = useState<string>('')

  async function refresh(u: string) {
    const a = await getBalance(u)
    setAccBalance(a)
    const pig = await getDoc(doc(db, 'piggy', u))
    setPigBalance(Number((pig.data() as any)?.balance || 0))
  }

  useEffect(() => subscribe(s => { if (s.user) { setUid(s.user.uid); refresh(s.user.uid) } }), [])

  async function deposit() { setMsg(''); try { await depositToPiggy(uid, amount); await refresh(uid); setMsg(t('deposited')) } catch (e:any) { setMsg(e?.message || 'Error')} }
  async function withdraw() { setMsg(''); try { await withdrawFromPiggy(uid, amount); await refresh(uid); setMsg(t('withdrawn')) } catch (e:any) { setMsg(e?.message || 'Error')} }

  return (
    <div className="container" style={{ maxWidth:700 }}>
      <div className="card">
        <h2>{t('piggy_title')}</h2>
        <p>{t('piggy_account')}: {accBalance.toFixed(2)} €</p>
        <p>{t('piggy_pig')}: {pigBalance.toFixed(2)} €</p>
        <div className="form-row"><div className="label">{t('piggy_amount')}</div><input type="number" className="input" value={amount} onChange={e=>setAmount(Number(e.target.value))} /></div>
        <div className="actions">
          <button onClick={deposit}>{t('piggy_deposit')}</button>
          <button className="secondary" onClick={withdraw}>{t('piggy_withdraw')}</button>
        </div>
        {msg && <p className="subtitle" style={{ color:'#7bd3ff' }}>{msg}</p>}
      </div>
    </div>
  )
}
