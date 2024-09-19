beforeEach(() => {
  cy.visit('/signin')
})

describe('Sign in', () => {
  it('shows sign in title', () => {
    cy.findByTestId('title').contains('Sign in')
  })

  it('directs users to sign up view', () => {
    cy.findByTestId('switch-link').click()
    cy.location('pathname', { timeout: 60000 }).should('eq', '/signup')
  })
})
