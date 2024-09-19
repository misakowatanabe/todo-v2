beforeEach(() => {
  cy.visit('/signup')
})

describe('Sign in', () => {
  it('shows sign in title', () => {
    cy.findByTestId('title').contains('Sign up')
  })

  it('directs users to sign in view', () => {
    cy.findByTestId('switch-link').click()
    cy.location('pathname', { timeout: 60000 }).should('eq', '/signin')
  })
})
