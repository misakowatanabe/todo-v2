import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
    specPattern: 'app/**/*.cy.{ts,tsx}',
    baseUrl: 'http://localhost:3000',
    viewportHeight: 800,
    viewportWidth: 1280,
  },
})
