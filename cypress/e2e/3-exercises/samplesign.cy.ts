describe('Registration Form', () => {
    xit('Sign Up', () => {
        // cy.visit('https://qavbox.github.io/demo/signup/');
        // cy.get('input.EnterText', {log:false}).type('Radhakrishna');
        // cy.get('input[name="home"]').click();
      
      cy.visit('https://qavbox.github.io/demo/delay/')
      cy.get('input[name=\'commit1\']').click()
      cy.get('#delay', {timeout: 6000}).should('have.text', "I appeared after 5 sec")
    })

    it('cy get withinsubject', () => {
        cy.visit('https://qavbox.github.io/demo/signup/');
        cy.get('#username', {withinSubject: document.getElementById('container')}).type('Radhakrishna');
    })

    it.only('cy get find', () => {
        cy.visit('https://qavbox.github.io/demo/webtable/');
        cy.get('#table01').find('thead').find('th').should('have.length', 4)
        // cy.get('input[name="home"]').click();
    })
})