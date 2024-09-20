async function clearFirestore() {
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

async function clearAuth() {
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

beforeEach(async () => {
  cy.clearCookies()
  await clearFirestore()
  await clearAuth()
  cy.visit('/signup')
})

describe('Page', () => {
  it('shows sign in title', () => {
    cy.findByTestId('title').contains('Sign up')
  })

  it('directs users to sign in view', () => {
    cy.findByTestId('switch-link').click()
    cy.location('pathname', { timeout: 60000 }).should('eq', '/signin')
  })
})

describe('Sign up', () => {
  it('signs up a user', () => {
    cy.findByTestId('input-name').type('Misako')
    cy.findByTestId('input-email').type('misako@example.com')
    cy.findByTestId('input-password').type('password')
    cy.findByTestId('input-password-confirmation').type('password')
    cy.findByTestId('submit').click()

    cy.location('pathname', { timeout: 60000 }).should('eq', '/all')
  })
})
