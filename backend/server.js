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
      // const uid = await getUidFromIdToken(req.body.idToken)

      db.collection('UID')
        .doc('todos')
        .onSnapshot(
          async (docSnapshot) => {
            // TODO: use actual uid
            const order = await db.collection('UID').doc('order').get()
            const activeOrder = order.data().active
            const todoListActive = Object.values(docSnapshot.data()).filter((el) => {
              return !el.completed
            })

            todoListActive.sort((a, b) => {
              return activeOrder.indexOf(a.todoId) - activeOrder.indexOf(b.todoId)
            })

            // TODO: add this with sorting function based on when last updated, then import it to frontend
            // const todoListCompleted = Object.values(docSnapshot.data()).filter((el) => {
            //   return el.completed
            // })

            connectionSocket.emit('todos', todoListActive)
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
        .collection('UID')
        .doc('order')
        .update({
          active: FieldValue.arrayRemove(...req.body.order),
        })
      await db
        .collection('UID')
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

// create todo
app.post('/create', (req, res) => {
  ;(async () => {
    try {
      // TODO: use actual uid
      const order = await db.collection('UID').doc('order').get()
      const activeOrder = order.data().active

      await db
        .collection('UID')
        .doc('order')
        .update({
          active: FieldValue.arrayRemove(...activeOrder),
        })

      activeOrder.splice(0, 0, req.body.todoId)

      await db
        .collection('UID')
        .doc('order')
        .update({
          active: FieldValue.arrayUnion(...activeOrder),
        })
    } catch (err) {
      // The update will fail if applied to a document that does not exist
      res.status(400).send(err.details)
    }

    try {
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

      await db.collection('UID').doc('todos').update(todoObject)

      res.sendStatus(200)
    } catch (err) {
      // The update will fail if applied to a document that does not exist
      res.status(400).send(err.details)
    }
  })()
})

// update todo
app.put('/update/:todoId', (req, res) => {
  ;(async () => {
    try {
      const document = db
        .collection(req.body.userUid)
        .doc('todos')
        .collection('active')
        .doc(req.params.todoId)
      await document.update({
        title: req.body.title,
        body: req.body.body,
        updatedAt: req.body.updatedAt,
      })
      return res.status(200).json({ message: 200 })
    } catch (error) {
      return res.status(500).json({ message: 500 })
    }
  })()
})

// delete todo
app.delete('/delete/:userUid/:todoId', (req, res) => {
  ;(async () => {
    try {
      const document = db
        .collection(req.params.userUid)
        .doc('todos')
        .collection('active')
        .doc(req.params.todoId)
      await document.delete()
      return res.status(200).json({ message: 200 })
    } catch (error) {
      return res.status(500).json({ message: 500 })
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
