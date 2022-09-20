//#Array includes another array
describe('#Array includes another array', () => {

	it('Array', () => {
		const countries = ['Germany', 'US', 'India', 'Norway']
		const list = ['US', 'India']

		//we want to check if the "countries" array includes every country on the given list
		const diff = Cypress._.difference(list, countries)
		expect(diff).to.be.empty
	})

})
