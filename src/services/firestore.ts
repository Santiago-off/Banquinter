import { db } from '../firebase'
import { doc, getDoc, runTransaction, setDoc, Timestamp, getDocs, collection, query, where } from 'firebase/firestore'

export async function getBalance(uid: string) {
  const snap = await getDoc(doc(db, 'accounts', uid))
  return (snap.data() as any)?.balance ?? 0
}

export async function getAccount(uid: string) {
  const snap = await getDoc(doc(db, 'accounts', uid))
  return snap.data() as any
}

export async function getUidByAccountNumber(number: string) {
  const qs = await getDocs(query(collection(db, 'accounts'), where('number', '==', number)))
  const docSnap = qs.docs[0]
  return docSnap ? docSnap.id : null
}

export async function transfer(fromUid: string, toUid: string, amount: number, note?: string) {
  if (amount <= 0) throw new Error('Cantidad inválida')
  await runTransaction(db, async (tx) => {
    const fromRef = doc(db, 'accounts', fromUid)
    const toRef = doc(db, 'accounts', toUid)
    const from = (await tx.get(fromRef)).data() as any
    const to = (await tx.get(toRef)).data() as any
    if (!from || !to) throw new Error('Cuenta no encontrada')
    if (from.frozen) throw new Error('Cuenta bloqueada')
    const fb = Number(from.balance || 0)
    const tb = Number(to.balance || 0)
    if (fb < amount) throw new Error('Fondos insuficientes')
    tx.set(fromRef, { ...from, balance: fb - amount })
    tx.set(toRef, { ...to, balance: tb + amount })
    const logId = `${Date.now()}_${Math.random().toString(36).slice(2)}`
    tx.set(doc(db, 'transfers', logId), {
      fromUid, toUid, amount, note: note || null, at: Timestamp.now()
    })
  })
}

export async function transferByAccountNumber(fromUid: string, toNumber: string, amount: number, note?: string) {
  const toUid = await getUidByAccountNumber(toNumber)
  if (!toUid) throw new Error('Cuenta destino no encontrada')
  await transfer(fromUid, toUid, amount, note)
}

export async function depositToPiggy(uid: string, amount: number) {
  await runTransaction(db, async (tx) => {
    const accRef = doc(db, 'accounts', uid)
    const pigRef = doc(db, 'piggy', uid)
    const acc = (await tx.get(accRef)).data() as any
    const pig = (await tx.get(pigRef)).data() as any || { balance: 0 }
    if (!acc) throw new Error('Cuenta no encontrada')
    const fb = Number(acc.balance || 0)
    if (fb < amount) throw new Error('Fondos insuficientes')
    tx.set(accRef, { ...acc, balance: fb - amount })
    tx.set(pigRef, { ...pig, balance: Number(pig.balance || 0) + amount })
  })
}

export async function withdrawFromPiggy(uid: string, amount: number) {
  await runTransaction(db, async (tx) => {
    const accRef = doc(db, 'accounts', uid)
    const pigRef = doc(db, 'piggy', uid)
    const acc = (await tx.get(accRef)).data() as any
    const pig = (await tx.get(pigRef)).data() as any
    if (!acc || !pig) throw new Error('Cuenta no encontrada')
    const pb = Number(pig.balance || 0)
    if (pb < amount) throw new Error('Fondos insuficientes en hucha')
    tx.set(pigRef, { ...pig, balance: pb - amount })
    tx.set(accRef, { ...acc, balance: Number(acc.balance || 0) + amount })
  })
}

export async function getTAE() {
  const snap = await getDoc(doc(db, 'config', 'global'))
  return (snap.data() as any)?.TAE ?? 2.5
}

export async function setTAE(uid: string, tae: number) {
  // Trusted by admin guard in UI; rules restrict to admin
  await setDoc(doc(db, 'config', 'global'), { TAE: tae }, { merge: true })
}

export async function getTransfers(uid: string) {
  const fromQs = await getDocs(query(collection(db, 'transfers'), where('fromUid', '==', uid)))
  const toQs = await getDocs(query(collection(db, 'transfers'), where('toUid', '==', uid)))
  const rows = [...fromQs.docs, ...toQs.docs].map(d => ({ id: d.id, ...(d.data() as any) }))
  rows.sort((a,b) => (b.at?.toMillis?.() || 0) - (a.at?.toMillis?.() || 0))
  return rows
}
