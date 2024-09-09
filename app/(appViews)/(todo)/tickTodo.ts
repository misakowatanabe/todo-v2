import { db } from 'app/firebase'
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { User } from 'firebase/auth/web-extension'
import { Todo } from 'app/actions'

export async function tickTodo(uid: User['uid'], todoId: Pick<Todo, 'todoId'>) {
  tickTodo: try {
    const todos = await getDoc(doc(db, uid, 'todos'))
    const todosData = todos.data()

    if (!todosData) {
      break tickTodo
    }

    const id = todoId
    const completed = `${id}.completed`

    await updateDoc(doc(db, uid, 'todos'), {
      [completed]: true,
    })
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }

  modifyOrder: try {
    const order = await getDoc(doc(db, uid, 'order'))
    const orderData = order.data()

    if (!orderData) {
      break modifyOrder
    }

    const indexOfTodoId = orderData.active.indexOf(todoId)

    // remove the completed todo ID from active todo's order array
    await updateDoc(doc(db, uid, 'order'), {
      active: arrayRemove(...orderData.active),
    })

    orderData.active.splice(indexOfTodoId, 1)

    if (orderData.active.length !== 0) {
      await updateDoc(doc(db, uid, 'order'), {
        active: arrayUnion(...orderData.active),
      })
    }

    // when there is at least 1 completed todo
    if (orderData.completed.length !== 0) {
      await updateDoc(doc(db, uid, 'order'), {
        completed: arrayRemove(...orderData.completed),
      })

      // add the todo ID to index 0 in completed todos array in the order doc
      orderData.completed.splice(0, 0, todoId)

      await updateDoc(doc(db, uid, 'order'), {
        completed: arrayUnion(...orderData.completed),
      })

      break modifyOrder
    }

    // when there is no completed todo, but there is order doc with empty array, ex: first time to tick, or after deleting all completed todos
    await updateDoc(doc(db, uid, 'order'), {
      completed: [todoId],
    })
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }

  return { ok: true, error: '' }
}
