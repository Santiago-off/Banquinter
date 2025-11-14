import { ReactNode, useEffect, useState } from 'react'
import { subscribe } from '../state/auth'
import { Navigate } from 'react-router-dom'

export default function AuthGuard({ children }: { children: ReactNode }) {
  const [isAuthed, setAuthed] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => subscribe(s => { setAuthed(!!s.user && s.verifiedKey); setReady(!!s.ready) }), [])
  if (!ready) return <></>
  if (!isAuthed) return <Navigate to="/login" replace />
  return <>{children}</>
}
