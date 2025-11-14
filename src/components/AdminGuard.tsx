import { ReactNode, useEffect, useState } from 'react'
import { subscribe } from '../state/auth'
import { Navigate } from 'react-router-dom'

export default function AdminGuard({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => subscribe(s => { setOk(!!s.user && s.verifiedKey && s.role==='admin'); setReady(!!s.ready) }), [])
  if (!ready) return <></>
  if (!ok) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
