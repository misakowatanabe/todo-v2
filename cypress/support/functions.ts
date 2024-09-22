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

export async function createUser(email: string, password: string) {
  const firebaseEmulatorApiKey = Cypress.env('FIREBASE_API_KEY')
  const authEmulatorPort = Cypress.env('FIREBASE_AUTH_EMULATOR_PORT')

  const res = await fetch(
    `http://localhost:${authEmulatorPort}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseEmulatorApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true,
      }),
    },
  )

  if (!res.ok)
    throw new Error(
      'Trouble creating a test user in Autherntication Emulator: ' + (await res.text()),
    )

  return res
}

export function signin(email: string, password: string) {
  cy.visit('/signin')
  cy.findByTestId('sign-in-input-email').type(email)
  cy.findByTestId('sign-in-input-password').type(password)
  cy.findByTestId('sign-in-submit').click()
  cy.location('pathname', { timeout: 60000 }).should('eq', '/all')
  cy.reload()
}

export function createTodo(title: string, body: string) {
  cy.findByTestId('create-todo').click({ force: true })
  cy.findByTestId('create-todo-title').type(title)
  cy.findByTestId('create-todo-body').type(body)
  cy.findByTestId('create-todo-submit').click({ force: true })
}
