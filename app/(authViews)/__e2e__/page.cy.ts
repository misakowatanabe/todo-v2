import { clearAuth, clearFirestore } from 'cypress/support/functions'

beforeEach(async () => {
  cy.clearCookies()
  await clearFirestore()
  await clearAuth()
  cy.visit('/signup')
})

describe('Authentication', () => {
  it('directs users from sign up view to sign in view, and bring back to sign up view', () => {
    cy.findByTestId('sign-up-title', { timeout: 60000 }).contains('Sign up')
    cy.findByTestId('sign-up-switch-link').click({ force: true })

    cy.location('pathname', { timeout: 60000 }).should('eq', '/signin')
    cy.reload()
    cy.findByTestId('sign-in-title', { timeout: 60000 }).contains('Sign in')
    cy.findByTestId('sign-in-switch-link').click({ force: true })

    cy.location('pathname', { timeout: 60000 }).should('eq', '/signup')
  })

  it('signs up, get a welcome todo, signs out and signs in', () => {
    // sign up
    cy.findByTestId('sign-up-input-name').type('Misako')
    cy.findByTestId('sign-up-input-email').type('misako@example.com')
    cy.findByTestId('sign-up-input-password').type('password')
    cy.findByTestId('sign-up-input-password-confirmation').type('password')
    cy.findByTestId('sign-up-submit').click()

    cy.location('pathname', { timeout: 60000 }).should('eq', '/all')
    cy.getCookie('user_logged_in').should('have.property', 'value', 'true')

    // check if welcome todo exists
    cy.findByTestId('todo-title').contains('Welcome!')
    cy.findByTestId('todo-body').contains('Happy todo listing :)')

    // sign out
    cy.findByTestId('sign-out').click()

    cy.location('pathname', { timeout: 60000 }).should('eq', '/signin')
    cy.getCookie('user_logged_in').should('not.exist')

    // sign in
    cy.findByTestId('sign-in-input-email').type('misako@example.com')
    cy.findByTestId('sign-in-input-password').type('password')
    cy.findByTestId('sign-in-submit').click()

    cy.location('pathname', { timeout: 60000 }).should('eq', '/all')
    cy.getCookie('user_logged_in').should('have.property', 'value', 'true')
  })
})
