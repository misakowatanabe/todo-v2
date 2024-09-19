import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
}

function getAuthEmulatorUrl() {
  const host = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST
  const port = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT

  return ['http://', host, ':', port].join('')
}

function getFirestoreEmulatorConfig() {
  const host = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST ?? ''
  const port = parseInt(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT ?? '', 10)

  return { host, port }
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

const shouldConnectEmulator = process.env.NEXT_PUBLIC_EMULATOR === 'true'

if (shouldConnectEmulator) {
  const url = getAuthEmulatorUrl()
  const { host, port } = getFirestoreEmulatorConfig()

  connectAuthEmulator(auth, url)
  connectFirestoreEmulator(db, host, port)
}
