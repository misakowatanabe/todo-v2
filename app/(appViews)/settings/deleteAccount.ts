import { db } from 'app/firebase'
import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import { User } from 'firebase/auth/web-extension'
import { deleteUser } from 'firebase/auth'

export async function deleteAccount(user: User) {
  // delete user-specific collection
  try {
    const orderDoc = await getDoc(doc(db, user.uid, 'order'))
    const labelsDoc = await getDoc(doc(db, user.uid, 'labels'))
    const todosDoc = await getDoc(doc(db, user.uid, 'todos'))

    if (orderDoc.exists()) {
      await deleteDoc(doc(db, user.uid, 'order'))
    }
    if (labelsDoc.exists()) {
      await deleteDoc(doc(db, user.uid, 'labels'))
    }
    if (todosDoc.exists()) {
      await deleteDoc(doc(db, user.uid, 'todos'))
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }

  // delete user account
  try {
    await deleteUser(user)
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }

  return { ok: true, error: '' }
}
