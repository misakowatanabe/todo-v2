import { getTodoLength } from 'app/(appViews)/labelList'
import { Todo } from 'app/actions'

test('getTodoLength', () => {
  const todos: Todo[] = [
    {
      todoId: 'id_1',
      title: 'Title',
      body: 'Body',
      labels: ['Work', 'Kids'],
      completed: false,
    },
    {
      todoId: 'id_2',
      title: 'Title',
      body: 'Body',
      labels: ['Kids'],
      completed: false,
    },
    {
      todoId: 'id_3',
      title: 'Title',
      body: 'Body',
      labels: ['Work', 'Personal'],
      completed: true,
    },
  ]

  expect(getTodoLength('Work', todos).length).toBe(2)
})
