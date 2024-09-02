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

var connectionSocket = null
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
async function getUidFromIdToken(idToken) {
  const decodedToken = await auth.verifyIdToken(idToken, true)
  uid = decodedToken.uid
  return uid
}

app.post('/sendIdToken', (req, res) => {
  ;(async () => {
    try {
      const uid = await getUidFromIdToken(req.body.idToken)

      db.collection(uid)
        .doc('todos')
        .onSnapshot(
          async (docSnapshot) => {
            const order = await db.collection(uid).doc('order').get()
            const orderData = order.data()
            const todosData = docSnapshot.data()
            let todoListActive = []
            let todoListCompleted = []

            // Skip filtering active todos unless there is any todo
            if (todosData) {
              todoListActive = Object.values(todosData).filter((el) => {
                return !el.completed
              })

              todoListCompleted = Object.values(todosData).filter((el) => {
                return el.completed
              })
            }

            // Skip ordering active todos unless there is order data
            if (orderData) {
              const activeOrder = orderData.active
              todoListActive.sort((a, b) => {
                return activeOrder.indexOf(a.todoId) - activeOrder.indexOf(b.todoId)
              })

              const completedOrder = orderData.completed
              todoListCompleted.sort((a, b) => {
                return completedOrder.indexOf(a.todoId) - completedOrder.indexOf(b.todoId)
              })
            }

            connectionSocket.emit('todos', { todoListActive, todoListCompleted })
          },
          (err) => {
            // A listen may occasionally fail — for example, due to security permissions, or if you tried to listen on an invalid query
            res.status(401).send(err.message)
          },
        )

      db.collection(uid)
        .doc('labels')
        .onSnapshot(
          async (docSnapshot) => {
            const labelsData = docSnapshot.data()
            let labelsArray = []
            if (labelsData) {
              labelsArray = Object.values(labelsData)
            }

            connectionSocket.emit('labels', labelsArray)
          },
          (err) => {
            // A listen may occasionally fail — for example, due to security permissions, or if you tried to listen on an invalid query
            res.status(401).send(err.message)
          },
        )

      res.sendStatus(200)
    } catch (err) {
      // Error happens either when the corresponding user is disabled or the session corresponding to the ID token was revoked
      res.status(401).send(err.message)
    }
  })()
})

// update order of todos
app.post('/updateOrder', (req, res) => {
  ;(async () => {
    try {
      await db
        .collection(uid)
        .doc('order')
        .update({
          active: FieldValue.arrayRemove(...req.body.order),
        })
      await db
        .collection(uid)
        .doc('order')
        .update({
          active: FieldValue.arrayUnion(...req.body.order),
        })

      res.sendStatus(200)
    } catch (err) {
      // The write fails if the document already exists
      res.status(400).send(err.details)
    }
  })()
})

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

// update auth user profile
app.post('/updateUser', (req, res) => {
  ;(async () => {
    try {
      const uid = await getUidFromIdToken(req.body.idToken)

      res.send(
        await auth.updateUser(uid, {
          displayName: req.body.displayName,
        }),
      )
    } catch (err) {
      // Error happens either when the corresponding user is disabled or the session corresponding to the ID token was revoked
      res.status(401).send(err.message)
    }
  })()
})

// create todo (it creates a todo object in the todos doc and adds its todo ID to index 0 in the order doc)
app.post('/create', (req, res) => {
  ;(async () => {
    createOrder: try {
      const order = await db.collection(uid).doc('order').get()
      const orderData = order.data()

      // create a order doc if there is none, then, set an active todo, ex: first todo after signup
      if (!orderData) {
        await db
          .collection(uid)
          .doc('order')
          .set({
            active: [req.body.todoId],
            completed: [],
          })

        break createOrder
      }

      // when there is at least 1 active todo
      if (orderData.active.length !== 0) {
        await db
          .collection(uid)
          .doc('order')
          .update({
            active: FieldValue.arrayRemove(...orderData.active),
          })

        orderData.active.splice(0, 0, req.body.todoId)

        await db
          .collection(uid)
          .doc('order')
          .update({
            active: FieldValue.arrayUnion(...orderData.active),
          })

        break createOrder
      }

      // when there is no todo, but there is order doc with empty array, ex: after ticking all active todos
      await db
        .collection(uid)
        .doc('order')
        .update({
          active: [req.body.todoId],
        })
    } catch (err) {
      // The update will fail if applied to a document that does not exist
      res.status(400).send(err.details)
    }

    createTodo: try {
      const todos = await db.collection(uid).doc('todos').get()
      const todosData = todos.data()

      // create a todos doc if there is none, ex: when creating the first todo after signup
      if (!todosData) {
        await db
          .collection(uid)
          .doc('todos')
          .set({
            [req.body.todoId]: {
              todoId: req.body.todoId,
              title: req.body.title,
              createdAt: req.body.createdAt,
              completed: req.body.completed,
            },
          })

        res.sendStatus(200)

        break createTodo
      }

      // create a new todo object in the todos doc if todos doc already exists
      const id = req.body.todoId

      const todoId = `${id}.todoId`
      const title = `${id}.title`
      const body = `${id}.body`
      const createdAt = `${id}.createdAt`
      const labels = `${id}.labels`
      const completed = `${id}.completed`

      const todoObject = {
        [todoId]: req.body.todoId,
        [title]: req.body.title,
        [createdAt]: req.body.createdAt,
        [completed]: req.body.completed,
      }

      if (req.body.body) {
        todoObject[body] = req.body.body
      }

      if (req.body.labels) {
        todoObject[labels] = req.body.labels
      }

      await db.collection(uid).doc('todos').update(todoObject)

      res.sendStatus(200)
    } catch (err) {
      // The update will fail if applied to a document that does not exist
      res.status(400).send(err.details)
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

// update userInfo(name) in firestore
app.put('/update-userInfo-name/:userUid', (req, res) => {
  ;(async () => {
    try {
      const document = db.collection(req.params.userUid).doc('userInfo')
      await document.update({
        name: req.body.name,
      })
      return res.status(200).json({ message: 200 })
    } catch (error) {
      return res.status(500).json({ message: 500 })
    }
  })()
})

// update userInfo(email) in firestore
app.put('/update-userInfo-email/:userUid', (req, res) => {
  ;(async () => {
    try {
      const document = db.collection(req.params.userUid).doc('userInfo')
      await document.update({
        email: req.body.email,
      })
      return res.status(200).json({ message: 200 })
    } catch (error) {
      return res.status(500).json({ message: 500 })
    }
  })()
})

// delete user account
app.delete('/deleteAccount/:userUid/', (req, res) => {
  ;(async () => {
    try {
      await auth.deleteUser(req.params.userUid)
      return res.status(200).json({ message: 200 })
    } catch (error) {
      return res.status(500).json({ message: 500 })
    }
  })()
})

// delete user collection
app.delete('/deleteCollection/:userUid/', (req, res) => {
  ;(async () => {
    try {
      async function deleteCollection() {
        const collectionRef = db.collection(req.params.userUid)
        const collectionRef2 = db.collection(req.params.userUid).doc('todos').collection('active')
        const query = collectionRef.orderBy('__name__').limit(100)
        const query2 = collectionRef2.orderBy('__name__').limit(100)

        return new Promise((resolve, reject) => {
          deleteQueryBatch(db, query, query2, resolve).catch(reject)
        })
      }

      async function deleteQueryBatch(db, query, query2, resolve) {
        const snapshot = await query.get()
        const snapshot2 = await query2.get()

        const batchSize = snapshot.size
        if (batchSize === 0) {
          resolve()
          return
        }
        const batchSize2 = snapshot2.size
        if (batchSize2 === 0) {
          resolve()
          return
        }

        // Delete documents in a batch
        const batch = db.batch()
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref)
        })
        snapshot2.docs.forEach((doc) => {
          batch.delete(doc.ref)
        })
        await batch.commit()

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
          deleteQueryBatch(db, query, query2, resolve)
        })
      }
      deleteCollection()
      return res.status(200).json({ message: 200 })
    } catch (error) {
      return res.status(500).json({ message: 500 })
    }
  })()
})
