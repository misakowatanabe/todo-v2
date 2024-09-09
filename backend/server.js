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
