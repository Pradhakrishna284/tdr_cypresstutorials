describe('desc contains', () => {
	it('test case', () => {
		cy.visit('https://qavbox.github.io/demo/signup/')
		//cy.contains('Full name', {matchCase: false}) //ignores the case sensitivity
		//cy.get('[href=\'http://www.qavalidation.com\']')
		//cy.contains('Tutorials').click()
		cy.get('footer').contains('qavalidation').click()
	})

	xit('list contains', () => {
		cy.visit('https://qavbox.github.io/demo/listitems/')
		
		cy.contains('ul', 'List Item 1') //it gives the ul tag of the List Item 1
		cy.contains('div', 'List Item 1') //it gives div tag of where the list item is present
		cy.contains('span', 'List Item 1') //assertion error, because the list item 1 element is not present in span tag
	})

	it('click submit button', () => {
		cy.visit('https://qavbox.github.io/demo/signup/')
		
		cy.get('#submit').click()
	})

	it('ecommerce site', () => {
		cy.visit('https://abstracta.us/industries/ecommerce')
		cy.get('a.btn-contact-us[href*=\'contact-us\']', {timeout:60000}).click({force:true})
	})
})