export async function clearFirestore() {
  const firestoreEmulatorPort = Cypress.env('FIRESTORE_EMULATOR_PORT')
  const projectId = Cypress.env('FIREBASE_PROJECT_ID')

  const res = await fetch(
    `http://localhost:${firestoreEmulatorPort}/emulator/v1/projects/${projectId}/databases/(default)/documents`,
    {
      method: 'DELETE',
    },
  )

  if (!res.ok) throw new Error('Trouble clearing Firestore Emulator: ' + (await res.text()))
}

export async function clearAuth() {
  const authEmulatorPort = Cypress.env('FIREBASE_AUTH_EMULATOR_PORT')
  const projectId = Cypress.env('FIREBASE_PROJECT_ID')

  const res = await fetch(
    `http://localhost:${authEmulatorPort}/emulator/v1/projects/${projectId}/accounts`,
    {
      method: 'DELETE',
    },
  )

  if (!res.ok) throw new Error('Trouble clearing Authentication Emulator: ' + (await res.text()))
}
