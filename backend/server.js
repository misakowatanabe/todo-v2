const express = require('express')
var cors = require('cors')
const http = require('http')
const socketIo = require('socket.io')

var frontendUrl
if (process.env.NODE_ENV === 'production') {
  frontendUrl = 'https://misakowatanabe.github.io'
} else {
  frontendUrl = 'http://localhost:3000'
}

var serviceAccountPath
if (process.env.NODE_ENV === 'production') {
  serviceAccountPath = '/app/APIkey/key.json'
} else {
  serviceAccountPath = './APIkey/key.json'
}

const port = process.env.PORT || 3001
const app = express()
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS')
  res.header('Access-Control-Allow-Credentials', true)
  next()
})
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
)
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  }),
)

var admin = require('firebase-admin')

const serviceAccount = require(serviceAccountPath)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://succulent-bfbf4.firebaseio.com',
})
const db = admin.firestore()
const auth = admin.auth()
admin.database()
const FieldValue = admin.firestore.FieldValue

const server = http.createServer(app)
// eslint-disable-next-line no-console
server.listen(port, () => console.log(`Listening on port ${port}`))
const io = socketIo(server, {
  cors: {
    origin: frontendUrl,
    credentials: true,
  },
})

io.on('connection', (socket) => {
  // eslint-disable-next-line no-console
  console.log('new client connected')
  connectionSocket = socket
  socket.on('disconnect', () => {
    // eslint-disable-next-line no-console
    console.log('client disconnected')
  })
})

var uid = null

// create a new label
app.post('/createLabel', (req, res) => {
  ;(async () => {
    createLabels: try {
      const labels = await db.collection(uid).doc('labels').get()
      const labelsData = labels.data()
      const objectName = req.body.label.replace(/ /g, '_').toLowerCase()

      // create a labels doc if there is none, ex: when creating the first label after signup
      if (!labelsData) {
        await db
          .collection(uid)
          .doc('labels')
          .set({
            [objectName]: {
              label: req.body.label,
              color: req.body.color,
            },
          })

        res.sendStatus(200)

        break createLabels
      }

      const isNotDuplicated = Object.keys(labelsData).every((el) => el !== objectName)

      if (isNotDuplicated) {
        await db
          .collection(uid)
          .doc('labels')
          .update({
            [objectName]: {
              label: req.body.label,
              color: req.body.color,
            },
          })

        res.sendStatus(200)
      } else {
        res.status(400).send('This label name already exists.')
      }
    } catch (err) {
      // TODO: report and monitor this error
      res.status(400).send('Something went wrong. Could not create a label.')
    }
  })()
})

// remove a label from tasks and delete the label
app.post('/removeLabel', (req, res) => {
  ;(async () => {
    try {
      const todos = await db.collection(uid).doc('todos').get()
      const todosData = todos.data()
      const labelName = req.body.label

      const todosWithDeletedLabel = Object.values(todosData).filter((el) => {
        return el.labels.includes(labelName)
      })

      todosWithDeletedLabel.forEach(async (todo) => {
        const labels = `${todo.todoId}.labels`

        await db
          .collection(uid)
          .doc('todos')
          .update({
            [labels]: FieldValue.arrayRemove(labelName),
          })
      })
    } catch (err) {
      // TODO: report and monitor this error
      res.status(400).send('Something went wrong. Could not remove the label from tasks.')
    }

    try {
      const fieldName = req.body.label.replace(/ /g, '_').toLowerCase()

      // Remove the label field from the labels doc
      await db
        .collection(uid)
        .doc('labels')
        .update({
          [fieldName]: FieldValue.delete(),
        })

      res.sendStatus(200)
    } catch (err) {
      // TODO: report and monitor this error
      res.status(400).send('Something went wrong. Could not delete a label.')
    }
  })()
})

// update todo
app.put('/update', (req, res) => {
  ;(async () => {
    updateTodo: try {
      const todos = await db.collection(uid).doc('todos').get()
      const todosData = todos.data()

      if (!todosData) {
        res.status(400).send('Oops! This todo was already removed.')

        break updateTodo
      }

      const id = req.body.todoId

      const title = `${id}.title`
      const body = `${id}.body`
      const labels = `${id}.labels`
      const completed = `${id}.completed`

      const todoObject = {}

      if (req.body.title) {
        todoObject[title] = req.body.title
      }

      if (req.body.body) {
        todoObject[body] = req.body.body
      }

      if (req.body.labels) {
        todoObject[labels] = req.body.labels
      }

      if (req.body.completed) {
        todoObject[completed] = req.body.completed
      }

      await db.collection(uid).doc('todos').update(todoObject)

      res.sendStatus(200)
    } catch (err) {
      res.status(400).send(err.details)
    }
  })()
})

// delete either active or completed todo
app.delete('/delete', (req, res) => {
  ;(async () => {
    // Remove the selected todo (ID) field from the todos doc
    try {
      await db
        .collection(uid)
        .doc('todos')
        .update({
          [req.body.todoId]: FieldValue.delete(),
        })
    } catch (err) {
      res.status(400).send(err.details)
    }

    // Remove the todo ID from the order doc
    try {
      const order = await db.collection(uid).doc('order').get()
      const orderData = order.data()
      const orderDataElements = req.body.completed ? orderData.completed : orderData.active
      const fieldName = req.body.completed ? 'completed' : 'active'
      const indexOfTodoId = orderDataElements.indexOf(req.body.todoId)

      await db
        .collection(uid)
        .doc('order')
        .update({
          [fieldName]: FieldValue.arrayRemove(...orderDataElements),
        })

      orderDataElements.splice(indexOfTodoId, 1)

      if (orderDataElements.length !== 0) {
        await db
          .collection(uid)
          .doc('order')
          .update({
            [fieldName]: FieldValue.arrayUnion(...orderDataElements),
          })
      }

      res.sendStatus(200)
    } catch (err) {
      res.status(400).send(err.details)
    }
  })()
})

// delete all completed todos
app.delete('/deleteCompleted', (req, res) => {
  ;(async () => {
    // Remove all completed todo (ID) fields from the todos doc
    try {
      const todos = await db.collection(uid).doc('todos').get()
      const todosData = todos.data()
      let todoListCompleted = []

      if (todosData) {
        todoListCompleted = Object.values(todosData).filter((el) => {
          return el.completed
        })

        todoListCompleted.forEach(async (el) => {
          await db
            .collection(uid)
            .doc('todos')
            .update({
              [el.todoId]: FieldValue.delete(),
            })
        })
      }
    } catch (err) {
      res.status(400).send(err.details)
    }

    // Remove all completed todo IDs from the order doc
    try {
      const order = await db.collection(uid).doc('order').get()
      const orderData = order.data()

      await db
        .collection(uid)
        .doc('order')
        .update({
          completed: FieldValue.arrayRemove(...orderData.completed),
        })

      res.sendStatus(200)
    } catch (err) {
      res.status(400).send(err.details)
    }
  })()
})

app.put('/tick', (req, res) => {
  ;(async () => {
    tickTodo: try {
      const todos = await db.collection(uid).doc('todos').get()
      const todosData = todos.data()

      if (!todosData) {
        res.status(400).send('Oops! This todo was already removed.')

        break tickTodo
      }

      const id = req.body.todoId
      const completed = `${id}.completed`

      await db
        .collection(uid)
        .doc('todos')
        .update({
          [completed]: true,
        })
    } catch (err) {
      res.status(400).send(err.details)
    }

    modifyOrder: try {
      const order = await db.collection(uid).doc('order').get()
      const orderData = order.data()
      const indexOfTodoId = orderData.active.indexOf(req.body.todoId)

      // Remove the completed todo ID from active todo's order array
      await db
        .collection(uid)
        .doc('order')
        .update({
          active: FieldValue.arrayRemove(...orderData.active),
        })

      orderData.active.splice(indexOfTodoId, 1)

      if (orderData.active.length !== 0) {
        await db
          .collection(uid)
          .doc('order')
          .update({
            active: FieldValue.arrayUnion(...orderData.active),
          })
      }

      // when there is at least 1 completed todo
      if (orderData.completed.length !== 0) {
        await db
          .collection(uid)
          .doc('order')
          .update({
            completed: FieldValue.arrayRemove(...orderData.completed),
          })

        // Add the todo ID to index 0 in completed todos array in the order doc
        orderData.completed.splice(0, 0, req.body.todoId)

        await db
          .collection(uid)
          .doc('order')
          .update({
            completed: FieldValue.arrayUnion(...orderData.completed),
          })

        res.sendStatus(200)

        break modifyOrder
      }

      // when there is no completed todo, but there is order doc with empty array, ex: first time to tick, or after deleting all completed todos
      await db
        .collection(uid)
        .doc('order')
        .update({
          completed: [req.body.todoId],
        })

      res.sendStatus(200)
    } catch (err) {
      // The update will fail if applied to a document that does not exist
      res.status(400).send(err.details)
    }
  })()
})

app.put('/untick', (req, res) => {
  ;(async () => {
    untickTodo: try {
      const todos = await db.collection(uid).doc('todos').get()
      const todosData = todos.data()

      if (!todosData) {
        res.status(400).send('Oops! This todo was already removed.')

        break untickTodo
      }

      const id = req.body.todoId
      const completed = `${id}.completed`

      await db
        .collection(uid)
        .doc('todos')
        .update({
          [completed]: false,
        })
    } catch (err) {
      res.status(400).send(err.details)

      break untickTodo
    }

    modifyOrder: try {
      const order = await db.collection(uid).doc('order').get()
      const orderData = order.data()
      const indexOfTodoId = orderData.completed.indexOf(req.body.todoId)

      // Remove the todo ID from completed todo's order array
      await db
        .collection(uid)
        .doc('order')
        .update({
          completed: FieldValue.arrayRemove(...orderData.completed),
        })

      orderData.completed.splice(indexOfTodoId, 1)

      if (orderData.completed.length !== 0) {
        await db
          .collection(uid)
          .doc('order')
          .update({
            completed: FieldValue.arrayUnion(...orderData.completed),
          })
      }

      // when there is at least 1 active todo
      if (orderData.active.length !== 0) {
        await db
          .collection(uid)
          .doc('order')
          .update({
            active: FieldValue.arrayRemove(...orderData.active),
          })

        // Add the todo ID to index 0 in active todos array in the order doc
        orderData.active.splice(0, 0, req.body.todoId)

        await db
          .collection(uid)
          .doc('order')
          .update({
            active: FieldValue.arrayUnion(...orderData.active),
          })

        res.sendStatus(200)

        break modifyOrder
      }

      // when there is no active todo, but there is order doc with empty array, ex: after ticking/deleting all active todos
      await db
        .collection(uid)
        .doc('order')
        .update({
          active: [req.body.todoId],
        })

      res.sendStatus(200)
    } catch (err) {
      // The update will fail if applied to a document that does not exist
      res.status(400).send(err.details)
    }
  })()
})

// delete user account
app.delete('/deleteAccount', (req, res) => {
  ;(async () => {
    // delete user collection (all todos-related info)
    try {
      const deleteQueryBatch = async (db, query, resolve) => {
        const snapshot = await query.get()

        const batchSize = snapshot.size
        if (batchSize === 0) {
          resolve()

          return
        }

        // Delete documents in a batch
        const batch = db.batch()
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref)
        })

        await batch.commit()

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
          deleteQueryBatch(db, query, resolve)
        })
      }

      const collectionRef = db.collection(uid)
      const query = collectionRef.orderBy('__name__').limit(100)

      await new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject)
      })
    } catch (error) {
      res.status(400).send(err.details)
    }

    // delete user account
    try {
      await auth.deleteUser(uid)
      res.sendStatus(200)
    } catch (error) {
      res.status(400).send(err.details)
    }
  })()
})
