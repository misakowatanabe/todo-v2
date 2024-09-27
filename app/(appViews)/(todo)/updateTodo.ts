import { db } from 'app/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { Todo } from 'app/actions'
import { User } from 'firebase/auth/web-extension'

export async function updateTodo(uid: User['uid'], todo: Todo) {
  updateTodo: try {
    const todos = await getDoc(doc(db, uid, 'todos'))
    const todosData = todos.data()

    if (!todosData) {
      // the todo was already removed
      break updateTodo
    }

    const id = todo.todoId

    const title = `${id}.title`
    const body = `${id}.body`
    const labels = `${id}.labels`
    const completed = `${id}.completed`

    const todoObject: Record<string, string | string[] | boolean> = {}

    if (todo.title) {
      todoObject[title] = todo.title
    }

    if (todo.body) {
      todoObject[body] = todo.body
    }

    if (todo.labels) {
      todoObject[labels] = todo.labels
    }

    if (todo.completed) {
      todoObject[completed] = todo.completed
    }

    await updateDoc(doc(db, uid, 'todos'), todoObject)
  } catch (err) {
    return { ok: false, error: 'Something happened! Could not update the todo.' }
  }
  return { ok: true, error: '' }
}
