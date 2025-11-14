import { useEffect, useState } from 'react'
import { getTAE } from '../services/firestore'
import { t } from '../state/i18n'

function calcTAE(amount: number, tae: number, months: number) {
  const r = tae / 100
  const monthly = r / 12
  let total = amount
  for (let i=0;i<months;i++) total *= (1+monthly)
  return total
}

function sparkline(amount: number, tae: number, months: number) {
  const w = 400, h = 100
  const points: Array<[number, number]> = []
  const r = tae / 100 / 12
  let v = amount
  for (let i=0;i<=months;i++) {
    const x = (i / months) * w
    points.push([x, v])
    v *= (1 + r)
  }
  const maxV = Math.max(...points.map(p => p[1]))
  const minV = Math.min(...points.map(p => p[1]))
  const d = points.map(([x,v],i) => `${i?'L':'M'}${x},${h - ((v - minV) / (maxV - minV || 1)) * h}`).join(' ')
  return { w, h, d }
}

export default function Investments() {
  const [tae, setTae] = useState<number>(2.5)
  const [amount, setAmount] = useState<number>(1000)
  const [months, setMonths] = useState<number>(12)

  useEffect(() => { getTAE().then(setTae).catch(()=>{}) }, [])

  const result = calcTAE(amount, tae, months)
  const s = sparkline(amount, tae, months)

  return (
    <div className="container" style={{ maxWidth:800 }}>
      <div className="card">
      <h2>{t('investments_title')}</h2>
      <p>{t('investments_tae')}: {tae}%</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div>
          <label>{t('investments_amount')}</label>
          <input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} />
        </div>
        <div>
          <label>{t('investments_months')}</label>
          <input type="number" value={months} onChange={e=>setMonths(Number(e.target.value))} />
        </div>
      </div>
      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        {[6,12,24,36].map(m => (<button key={m} className="secondary" onClick={()=>setMonths(m)}>{m}m</button>))}
      </div>
      <div style={{ marginTop:16 }}>
        <svg width={s.w} height={s.h}><path d={s.d} stroke="#0ea5e9" fill="none" strokeWidth="2"/></svg>
      </div>
      <p>{t('investments_result')}: {result.toFixed(2)} €</p>
      </div>
    </div>
  )
}
