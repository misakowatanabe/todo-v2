import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from 'app/firebase'
import { User } from 'firebase/auth'
import { Todo } from 'app/actions'

// it creates a todo object in the todos doc and adds its todo ID to index 0 in the order doc
export async function createTodo(user: User, todo: Todo) {
  createOrder: try {
    const order = await getDoc(doc(db, user.uid, 'order'))
    const orderData = order.data()

    // create a order doc if there is none, then, set an active todo, ex: first todo after signup
    if (!orderData) {
      await setDoc(doc(db, user.uid, 'order'), {
        active: [todo.todoId],
        completed: [],
      })

      break createOrder
    }

    // when there is at least 1 active todo
    if (orderData.active.length !== 0) {
      await updateDoc(doc(db, user.uid, 'order'), {
        active: arrayRemove(...orderData.active),
      })

      orderData.active.splice(0, 0, todo.todoId)

      await updateDoc(doc(db, user.uid, 'order'), {
        active: arrayUnion(...orderData.active),
      })

      break createOrder
    }

    // when there is no todo, but there is order doc with empty array, ex: after ticking all active todos
    await updateDoc(doc(db, user.uid, 'order'), {
      active: [todo.todoId],
    })
  } catch (err) {
    // the update will fail if applied to a document that does not exist
    console.error(err instanceof Error ? err.message : String(err))
    return { ok: false }
  }

  createTodo: try {
    const todos = await getDoc(doc(db, user.uid, 'todos'))
    const todosData = todos.data()

    // create a todos doc if there is none, ex: when creating the first todo after signup
    if (!todosData) {
      const todoObject: Todo = {
        todoId: todo.todoId,
        title: todo.title,
        completed: todo.completed,
      }

      if (todo.body) {
        todoObject['body'] = todo.body
      }

      if (todo.labels) {
        todoObject['labels'] = todo.labels
      }

      await setDoc(doc(db, user.uid, 'todos'), {
        [todo.todoId]: todoObject,
      })

      break createTodo
    }

    // create a new todo object in the todos doc if todos doc already exists
    const id = todo.todoId

    const todoId = `${id}.todoId`
    const title = `${id}.title`
    const body = `${id}.body`
    const labels = `${id}.labels`
    const completed = `${id}.completed`

    const todoObject: Record<string, string | string[] | boolean> = {
      [todoId]: todo.todoId,
      [title]: todo.title,
      [completed]: todo.completed,
    }

    if (todo.body) {
      todoObject[body] = todo.body
    }

    if (todo.labels) {
      todoObject[labels] = todo.labels
    }

    await updateDoc(doc(db, user.uid, 'todos'), todoObject)
  } catch (err) {
    return { ok: false }
  }

  return { ok: true }
}
