describe('desc frames', () => {
	
	it('iframes block', () => {
		cy.visit('https://qavbox.github.io/demo/iframes/')
		cy.get('#Frame2').its('0.contentDocument.body').find('#frameinput').type('qavbox')
		cy.get('#Frame2').its('0.contentDocument.body').contains('Category3').click()
		
	})
})