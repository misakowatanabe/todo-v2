import { db } from 'app/firebase'
import { arrayRemove, deleteField, doc, getDoc, updateDoc } from 'firebase/firestore'
import { User } from 'firebase/auth/web-extension'

// remove a label from todos and delete the label
export async function removeLabel(uid: User['uid'], label: string) {
  // remove a selected label from labels array value in each todo's field in the todos doc
  try {
    const todos = await getDoc(doc(db, uid, 'todos'))
    const todosData = todos.data()

    if (!todosData) return { ok: true, error: '' }

    const todosWithDeletedLabel = Object.values(todosData).filter((el) => {
      return el.labels.includes(label)
    })

    todosWithDeletedLabel.forEach(async (todo) => {
      const labels = `${todo.todoId}.labels`

      await updateDoc(doc(db, uid, 'todos'), {
        [labels]: arrayRemove(label),
      })
    })
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }

  // remove the label field from the labels doc
  try {
    const fieldName = label.replace(/ /g, '_').toLowerCase()

    await updateDoc(doc(db, uid, 'labels'), {
      [fieldName]: deleteField(),
    })
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }

  return { ok: true, error: '' }
}
