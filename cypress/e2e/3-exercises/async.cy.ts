describe('Aysnc & sync', () => {
	xit('cy async', () => {
		//https://www.youtube.com/watch?v=cMpzC91ws_0&list=PLPO0LFyCaSo1sEDJb6FR2a1iPl-48FDBL&index=5
		console.log('Navigate to url')
		//cy.log('Navigate to url')

//follow the video to understand the concept
		//console.log('enter username')

		setTimeout(() => {console.log('enter username')}, 2000)

		console.log('enter email')
	})

	it('cy async1', () => {
		//https://www.youtube.com/watch?v=cMpzC91ws_0&list=PLPO0LFyCaSo1sEDJb6FR2a1iPl-48FDBL&index=5
		console.log('Navigate to url') //non cypress async
		cy.visit('https://qavbox.github.io/demo/signup/') //cypress sync

		console.log('enter username') //non cypress async

		cy.get('#username').type('radha').then(() => {
			console.log('then - enter email')
		})

		console.log('enter email') //non cypress async
		cy.get('#email').type('test@gmail.com')
	})

	it.only('cy async2', () => {
		let str: any
		cy.visit('https://qavbox.github.io/demo/signup/') //cypress sync

		console.log('enter username') //non cypress async

		cy.get('#username').type('radha').invoke('val').then((myValue) => {
			str = myValue
			console.log('inside Then ' + str)
		})

		console.log('outside Then ' + str) //non cypress async
		cy.get('#email').type('test@gmail.com')
	})
})