import { parseInt } from "cypress/types/lodash"

describe('JE Mappings', () => {

	it('Login page', () => {
		cy.visit('http://content.qa.int.thomsonreuters.com:8081/user/login/qa')
		cy.get('#username').type('333333')
		cy.get('#password').type('testuser')
		cy.get('[type=\'submit\']').should('be.enabled').click()
	})

	it('Navigate to JE Mappings page', () => {

		//Click Groups menu
		cy.get('ul li[bentotoolbaritem] button[role=\'menuitem\'] span:nth-child(1)', { timeout: 60000 }).each(($menuItem) => {
			//within this li elements
			cy.wrap($menuItem).invoke('text').then((menuName) => {
				if (menuName == 'Groups') {
					cy.log(menuName)
					cy.wrap($menuItem).click()
					cy.log('User clicked ' + menuName + " Menu")
					return false //breaks the each loop
				}
			})
		})

		//2. Click JE Mappings tab
		cy.get('a[id=\'JE Mappings\']', { timeout: 3000 }).click()

		//4. Verify whether user is in je mappings page
		cy.url().should('include', '/groups/je-mappings')
	})

	it('Create', () => {	

		cy.get('wj-flex-grid.bento-flex-grid', {timeout:60000})
			.should('be.visible')
			.scrollIntoView()
			.viewport(1500, 660) //set the size of the grid

		/*
		cy.get('wj-flex-grid.bento-flex-grid div[role=\'row\']:nth-child(1)').within(() => {
			
			cy.get('div:nth-child(2)', {timeout:60000}).invoke('width').should('be.gt', 0)
			cy.get('div:nth-child(2)').invoke('width').then((width) => {
				cy.log("Width of element:- " + width.toString())
			})
			
		}) */

		/*//Get 2nd row in the grid, 
		cy.get('wj-flex-grid.bento-flex-grid div[role=\'row\']:nth-child(2)', { timeout: 60000 })
			.scrollIntoView()
			.within(() => { //within the 2nd row

				cy.get('[role=\'gridcell\']').should('have.length', 8) //validate the no. of columns
			
				//navigate through each column
				cy.get('div[role=\'gridcell\']').eq(0).scrollIntoView()
				cy.get('div[role=\'gridcell\']').eq(0).click({ force: true }) //Jurisdiction Logic Group
				cy.wait(3000)
				//cy.get('div[role=\'gridcell\']').eq(0).scrollTo('top')
				cy.get('div[role=\'gridcell\']').eq(0).click({ force: true })
				cy.get('input[type=\'text\']').scrollIntoView()
				cy.get('input[type=\'text\']').type('UsFloridaLocalGoodsOnlyJd')
				cy.wait(1500)

				cy.get('div[role=\'gridcell\']').eq(1).dblclick({force:true}) //Transaction Logic Path
				cy.get('input[role=\'combobox\']').type('227')
				cy.wait(1500)
				cy.get('span..wj-autocomplete-match').click()

				cy.get('div[role=\'gridcell\']').eq(2).dblclick() //Tax Type
				cy.get('input[type=\'text\']').type('MFE')

				cy.get('div[role=\'gridcell\']').eq(4).dblclick() //Start Date
				cy.get('input[type=\'tel\']').type('09/14/2022')			
		})*/

		cy.get('wj-flex-grid.bento-flex-grid div[role=\'row\']:nth-child(3)')
			.within(() => { //within the 3rd row

				cy.get('[role=\'gridcell\']').each(($column) => { //Iterate through each column
					cy.wrap($column).invoke('text').then((text) => { //For a column, get the text value
						cy.log(text)
					})
				})
		})

		//Click outside of grid
		//cy.get('pagination:nth-child(3) > bento-pagination:nth-child(1) > div:nth-child(1) > div:nth-child(2)').click()

		//Validate success message
		/*
			In cypress, to fire events, we use on method, for which we have to pass the event (window:alert), 
			this event yields the alert message and that is captured in str argument. We compare this
			argument(expected) with the value
		*/
		/*cy.on('window:alert', (str) => {
			expect(str).to.contains('JE Mappings created successfully')
		})*/
	})
})
