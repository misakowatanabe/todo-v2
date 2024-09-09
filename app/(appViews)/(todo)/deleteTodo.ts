import { db } from 'app/firebase'
import { arrayRemove, arrayUnion, deleteField, doc, getDoc, updateDoc } from 'firebase/firestore'
import { User } from 'firebase/auth/web-extension'

export async function deleteTodo(uid: User['uid'], todoId: string, completed: boolean) {
  // Remove the selected todo (ID) field from the todos doc
  try {
    await updateDoc(doc(db, uid, 'todos'), {
      [todoId]: deleteField(),
    })
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }

  // Remove the todo ID from the order doc
  try {
    const order = await getDoc(doc(db, uid, 'order'))
    const orderData = order.data()

    if (!orderData) return { ok: true, error: '' }

    const orderDataElements = completed ? orderData.completed : orderData.active
    const fieldName = completed ? 'completed' : 'active'
    const indexOfTodoId = orderDataElements.indexOf(todoId)

    await updateDoc(doc(db, uid, 'order'), {
      [fieldName]: arrayRemove(...orderDataElements),
    })

    orderDataElements.splice(indexOfTodoId, 1)

    if (orderDataElements.length !== 0) {
      await updateDoc(doc(db, uid, 'order'), {
        [fieldName]: arrayUnion(...orderDataElements),
      })
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }

  return { ok: true, error: '' }
}
