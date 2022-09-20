describe('My First Test', () => {
  it ('Visits the Kitchen Sink', () => {
    cy.visit('https://example.cypress.io')
    cy.contains('type').click()
    //should be on a new url which includes, '/commands/actions'
    cy.url().should('include', '/commands/actions')
    // Get an input, type into it and verify
    // that the value has been updated
    cy.get('input')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
})