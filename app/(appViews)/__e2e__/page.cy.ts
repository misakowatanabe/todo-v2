import {
  clearAuth,
  clearFirestore,
  createTodo,
  createUser,
  signin,
} from 'cypress/support/functions'

const email = 'user@test.com'
const password = 'password'
const title = 'Test title'
const body = 'Test body'
const label = 'Test label'

beforeEach(async () => {
  cy.clearCookies()
  await clearFirestore()
  await clearAuth()
  await createUser(email, password)
  signin(email, password)
})

describe('App functions', () => {
  it('creates a todo, updates a todo', () => {
    createTodo(title, body)

    // check if the todo has been created
    cy.findByTestId('table-todo-title').contains(title)
    cy.findByTestId('table-todo-body').contains(body)
    cy.findAllByTestId('table-todo').should('have.length', 1)

    const update = ' :updated!'

    // update todo
    cy.findByTestId('todo-detail-open').click({ force: true })
    cy.findByTestId('todo-detail-title').type(update)
    cy.findByTestId('todo-detail-body').type(update)
    cy.findByTestId('update-todo-submit').click({ force: true })

    // check if the todo has been updated
    cy.findByTestId('table-todo-title').contains(title + update)
    cy.findByTestId('table-todo-body').contains(body + update)
  })

  it('creates a label, updates a todo with the label, creates a dedicated view for the lable', () => {
    cy.findByTestId('create-label').click({ force: true })
    cy.findByTestId('create-label-name').type(label)
    cy.findByTestId('create-label-color-raspberry').click({ force: true })
    cy.findByTestId('create-label-submit').click({ force: true })

    // check if the label has been created
    cy.findByTestId('sidemenu-test-label').contains(label)

    createTodo(title, body)

    // update todo by adding the label
    cy.findByTestId('todo-detail-open').click({ force: true })
    cy.findByTestId('todo-detail-label-selection').type('{enter}')
    cy.findByTestId('update-todo-submit').click({ force: true })

    // check if the todo has been updated
    cy.findByTestId('table-todo-labels').children().should('have.length', 1)
    cy.findByTestId('table-todo-label-test-label').contains(label)

    // check if todo is allocated to a dedicated view based on label
    cy.findByTestId('sidemenu-test-label').click({ force: true })
    cy.location('pathname', { timeout: 60000 }).should('eq', '/label/Test_label')
    cy.reload()
    cy.findByTestId('table-todo-title').contains(title)
    cy.findByTestId('table-todo-body').contains(body)
  })

  it('switchs view between table and card', () => {
    createTodo(title, body)

    // go to card view
    cy.findByTestId('switch-view').click({ force: true })
    cy.findByTestId('card-todo-title').should('be.visible')
    cy.findByTestId('card-todo-body').should('be.visible')

    // go back to table view
    cy.findByTestId('switch-view').click({ force: true })
  })

  it('ticks/unticks a todo', () => {
    createTodo(title, body)

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
  })
})
