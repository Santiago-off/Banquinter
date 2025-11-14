import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

export type Session = {
  user: User | null
  role: 'user' | 'admin' | null
  verifiedKey: boolean
  ready: boolean
}

let session: Session = { user: null, role: null, verifiedKey: false, ready: false }
const listeners: Array<(s: Session) => void> = []

function notify() { listeners.forEach(l => l(session)) }

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    session = { user: null, role: null, verifiedKey: false, ready: true }
    notify()
    return
  }
  const adminBootstrapEmail = import.meta.env.VITE_ADMIN_EMAIL as string | undefined
  let role: 'user' | 'admin' = (adminBootstrapEmail && user.email === adminBootstrapEmail) ? 'admin' : 'user'
  try {
    const snap = await getDoc(doc(db, 'users', user.uid))
    const data = snap.data() as any
    if (data?.role === 'admin') role = 'admin'
  } catch {}
  session = { user, role, verifiedKey: false, ready: true }
  notify()
})

export function subscribe(listener: (s: Session) => void) {
  listeners.push(listener)
  listener(session)
  return () => {
    const i = listeners.indexOf(listener)
    if (i >= 0) listeners.splice(i, 1)
  }
}

export function setVerifiedKey(v: boolean) { session = { ...session, verifiedKey: v }; notify() }
export async function logout() { await signOut(auth); session = { user: null, role: null, verifiedKey: false, ready: true }; notify() }
