import { db } from 'app/firebase'
import { arrayRemove, deleteField, doc, getDoc, updateDoc } from 'firebase/firestore'
import { User } from 'firebase/auth/web-extension'

export async function deleteCompletedTodos(uid: User['uid']) {
  // remove all completed todo IDs from the order doc
  try {
    const order = await getDoc(doc(db, uid, 'order'))
    const orderData = order.data()

    if (!orderData) return { ok: true, error: '' }

    await updateDoc(doc(db, uid, 'order'), {
      completed: arrayRemove(...orderData.completed),
    })
  } catch (err) {
    return { ok: false, error: 'Something happened! Could not delete a label.' }
  }

  // remove all completed todo (ID) fields from the todos doc
  // User can try deleting the completed todos again from UI even if this function failed.
  try {
    const todos = await getDoc(doc(db, uid, 'todos'))
    const todosData = todos.data()
    let todoListCompleted = []

    if (todosData) {
      todoListCompleted = Object.values(todosData).filter((el) => {
        return el.completed
      })

      todoListCompleted.forEach(async (el) => {
        await updateDoc(doc(db, uid, 'todos'), {
          [el.todoId]: deleteField(),
        })
      })
    }
  } catch (err) {
    return { ok: false, error: 'Something happened! Could not delete completed todos.' }
  }

  return { ok: true, error: '' }
}
