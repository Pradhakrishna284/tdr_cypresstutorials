import { interfaces } from "mocha"

describe('Attribute Value', () => {
	xit('Text box fetch value or entered text', () => {
		cy.visit('https://qavbox.github.io/demo/signup/') //cypress sync

//to fetch enter valued from text box
		cy.get('#username').type('radha').invoke('val').then((myValue:any) => {
			cy.log(myValue)
			//expect todo

		})

		cy.get('#username').clear().type('radha').should('have.value', 'radha')

	})

	xit('fetch text from browser element', () => {
		cy.visit('https://qavbox.github.io/demo/signup/') //cypress sync

//to fetch text from browser element
		cy.get('#lblname').invoke('text').then((myValue:any) => {
			cy.log(myValue)
			//expect todo

		})

		cy.get('#lblname').should('have.text', 'Full Name')

	})

	xit('fetch properties or attributes of a browser element', () => {
		cy.visit('https://qavbox.github.io/demo/signup/') //cypress sync

//to fetch text from browser element
		cy.get('input[value=\'TestingBasics\']').click().invoke('prop', 'checked').then((myValue) => {
			cy.log(myValue)
		})

	})

	xit('cy dropdownlist select single element', () => {
		cy.visit('https://qavbox.github.io/demo/signup/') //cypress sync

//to fetch text from browser element
		cy.get('[name=\'sgender\']').select('na').invoke('val').then((myValue) => {
			cy.log('selected value ' + myValue)
			//expect todo
		}) //selecting based on value

		cy.wait(3000)

		cy.get('[name=\'sgender\']').select('na').find('option:selected').invoke('text').then((textValue) => {
		cy.log('selected text ' + textValue)
	})

//returns the element that is selected, invoke gives the text
	cy.get('[name=\'sgender\']').find('option:selected').should('have.text', 'Not Applicable')

		cy.wait(3000)
		cy.get('[name=\'sgender\']').select('Female').should('have.value', 'female') //selecting based on text	

	})

	})

	it('cy dropdownlist select multiple element', () => {
		cy.visit('https://qavbox.github.io/demo/signup/') //cypress sync

		//selecting based on value
		cy.get('#tools').select('docker').invoke('val').then((myValue) => {
			cy.log('selected based on value ' + myValue)
		})

		cy.wait(5000)
		//multiple select
		// cy.get('#tools').select(['Docker', 'TestStackWhite', 'JMeter']).invoke('val').then((val) => {
		// 	cy.log(val)
		// 	console.log(val)
		// })

		cy.get('#tools').select(['Docker', 'TestStackWhite', 'JMeter']).find('option:selected').each(($el) =>{

			cy.wrap($el).invoke('val').then((value) => {
				cy.log(value)
			})

			cy.wait(2000)

			cy.wrap($el).invoke('text').then((text) => {
				cy.log(text)
			})
		})

		cy.get('#tools').select(['Docker', 'TestStackWhite', 'JMeter']).invoke('val').should('deep.equal', ['docker', 'white', 'jmeter'])
		
})