import { db } from 'app/firebase'
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { User } from 'firebase/auth/web-extension'
import { Todo } from 'app/actions'

export async function untickTodo(uid: User['uid'], todoId: Pick<Todo, 'todoId'>) {
  modifyOrder: try {
    const order = await getDoc(doc(db, uid, 'order'))
    const orderData = order.data()

    if (!orderData) {
      break modifyOrder
    }

    const indexOfTodoId = orderData.completed.indexOf(todoId)

    // remove the todo ID from completed todo's order array
    await updateDoc(doc(db, uid, 'order'), {
      completed: arrayRemove(...orderData.completed),
    })

    orderData.completed.splice(indexOfTodoId, 1)

    if (orderData.completed.length !== 0) {
      await updateDoc(doc(db, uid, 'order'), {
        completed: arrayUnion(...orderData.completed),
      })
    }

    // when there is at least 1 active todo
    if (orderData.active.length !== 0) {
      await updateDoc(doc(db, uid, 'order'), {
        active: arrayRemove(...orderData.active),
      })

      // add the todo ID to index 0 in active todos array in the order doc
      orderData.active.splice(0, 0, todoId)

      await updateDoc(doc(db, uid, 'order'), {
        active: arrayUnion(...orderData.active),
      })

      break modifyOrder
    }

    // when there is no active todo, but there is order doc with empty array, ex: after ticking/deleting all active todos
    await updateDoc(doc(db, uid, 'order'), {
      active: [todoId],
    })
  } catch (err) {
    return { ok: false, error: 'Something happened! Could not untick the selected todo.' }
  }

  // User can try unticking a todo again from UI even if this function failed.
  untickTodo: try {
    const todos = await getDoc(doc(db, uid, 'todos'))
    const todosData = todos.data()

    if (!todosData) {
      break untickTodo
    }

    const id = todoId
    const completed = `${id}.completed`

    await updateDoc(doc(db, uid, 'todos'), {
      [completed]: false,
    })
  } catch (err) {
    return { ok: false, error: 'Something happened! Could not untick the selected todo.' }
  }

  return { ok: true, error: '' }
}
