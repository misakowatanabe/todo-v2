import { clearAuth, clearFirestore } from 'cypress/support/functions'

export async function createUser() {
  const firebaseEmulatorApiKey = Cypress.env('FIREBASE_API_KEY')
  const authEmulatorPort = Cypress.env('FIREBASE_AUTH_EMULATOR_PORT')

  const res = await fetch(
    `http://localhost:${authEmulatorPort}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseEmulatorApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@test.com',
        password: 'password',
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

beforeEach(async () => {
  cy.clearCookies()
  await clearFirestore()
  await clearAuth()
  await createUser()

  cy.visit('/signin')
})

describe('Todo app functions', () => {
  it('sign in, create a todo, create a label, update a todo, switch view, tick/untick a todo', () => {
    // sign in
    cy.findByTestId('sign-in-input-email').type('user@test.com')
    cy.findByTestId('sign-in-input-password').type('password')
    cy.findByTestId('sign-in-submit').click()
    cy.location('pathname', { timeout: 60000 }).should('eq', '/all')
    cy.reload()

    // create a todo
    cy.findByTestId('create-todo').click({ force: true })
    cy.findByTestId('create-todo-title').type('Test title')
    cy.findByTestId('create-todo-body').type('Test body')
    cy.findByTestId('create-todo-submit').click({ force: true })

    // check if the todo has been created
    cy.findByTestId('table-todo-title').contains('Test title')
    cy.findByTestId('table-todo-body').contains('Test body')
    cy.findAllByTestId('table-todo').should('have.length', 1)

    // create a label
    cy.findByTestId('create-label').click({ force: true })
    cy.findByTestId('create-label-name').type('Test label')
    cy.findByTestId('create-label-color-raspberry').click({ force: true })
    cy.findByTestId('create-label-submit').click({ force: true })

    // check if the label has been created
    cy.findByTestId('sidemenu-test-label').contains('Test label')

    // update todo
    cy.findByTestId('todo-detail-open').click({ force: true })
    cy.findByTestId('todo-detail-title').type(' :updated!')
    cy.findByTestId('todo-detail-body').type(' :updated!')
    cy.findByTestId('todo-detail-label-selection').type('{enter}')
    cy.findByTestId('update-todo-submit').click({ force: true })

    // check if the todo has been updated
    cy.findByTestId('table-todo-title').contains('Test title :updated!')
    cy.findByTestId('table-todo-body').contains('Test body :updated!')
    cy.findByTestId('table-todo-labels').children().should('have.length', 1)
    cy.findByTestId('table-todo-label-test-label').contains('Test label')

    // check if todo is allocated to a dedicated view based on label
    cy.findByTestId('sidemenu-test-label').click({ force: true })
    cy.location('pathname', { timeout: 60000 }).should('eq', '/label/Test_label')
    cy.reload()
    cy.findByTestId('table-todo-title').contains('Test title :updated!')
    cy.findByTestId('table-todo-body').contains('Test body :updated!')

    cy.findByTestId('sidemenu-all').click({ force: true })
    cy.location('pathname', { timeout: 60000 }).should('eq', '/all')
    cy.reload()

    // switch from table view to card view
    cy.findByTestId('switch-view').click({ force: true })
    cy.findByTestId('card-todo-title').should('be.visible')
    cy.findByTestId('card-todo-body').should('be.visible')
    cy.findByTestId('card-todo-labels').children().should('have.length', 1)

    cy.findByTestId('switch-view').click({ force: true })

    // tick a todo
    cy.findAllByTestId('table-todo').should('have.length', 1)
    cy.findAllByTestId('completed-table-todo').should('have.length', 0)
    cy.findByTestId('table-todo-checkbox').click({ force: true })
    cy.findByTestId('open-completed').click({ force: true })
    cy.findAllByTestId('table-todo').should('have.length', 0)
    cy.findAllByTestId('completed-table-todo').should('have.length', 1)

    // untick a todo
    cy.findByTestId('completed-table-todo-checkbox').click({ force: true })
    cy.findAllByTestId('table-todo').should('have.length', 1)
    cy.findAllByTestId('completed-table-todo').should('have.length', 0)

    // TODO:
    // delete a todo
    // delete all completed todo
    // change user info
    // delete user account
  })
})
