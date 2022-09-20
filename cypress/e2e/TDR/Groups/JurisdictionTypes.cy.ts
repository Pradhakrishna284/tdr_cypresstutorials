describe('Jurisdiction Type', () => {

	it('Login page', () => {
		cy.visit('http://content.dev.int.thomsonreuters.com:8081/user/login/qa')
		cy.get('#username').type('555555')
		cy.get('#password').type('testuser')
		cy.get('[type=\'submit\']').should('be.enabled').click()
	})


describe('Create & Update Jurisdiction Type', () => {

		it('Navigate to Jurisdiction Type page', () => {

			//Click Groups menu
			cy.get('ul li[bentotoolbaritem] button[role=\'menuitem\'] span:nth-child(1)').each(($menuItem) => {
				//within this li elements
				cy.wrap($menuItem).invoke('text').then((menuName) => {
						if(menuName == 'Groups')
						{
							cy.log(menuName)
							cy.wrap($menuItem).click()
							cy.log('User clicked ' + menuName + "Menu")
							return false //breaks the each loop
						}
				})
			})

			//2. Click Jurisdiction Types down arrow button
			cy.get('a[id=\'Jurisdiction Types\'] a[class=\'dropdown-toggle-split dropdown-toggle\']', {timeout: 3000}).click()

			//3. Click "Create New" button
			cy.get('a[href=\'/groups/jurisdiction-types/add\']').click()

			//4. Verify whether user is in create page
			cy.url().should('include', '/groups/jurisdiction-types/add')
		})

		it('Create', () => {

			//Header section
			cy.get('#name').type('Test_JT_14')	
			cy.get('#fullName').type('FN_Test_JT_14')
			cy.get('#startDate').type('09/14/2022')
			cy.get('#description').type('description Test_JT_14')
			
			//1. Publication Tags
			let arrayPublicationTags: string[] = ['Determination', 'United States', 'Mid/Downstream']

			arrayPublicationTags.forEach(function (value) {				
				//Click 2nd row
				cy.get('publication-grid div[role=\'row\']:nth-child(2) div[role=\'gridcell\']', {timeout: 3000}).dblclick().within(() => {
					cy.get('input').type(value)
				})
								
				//Click outside of publication tags grid, to add the data row
				//cy.get('collapse-wrapper[ng-reflect-title^= \'Publication Tags\']', {timeout: 3000}).click()	
				cy.get('#description').click()
				cy.wait(1000)
			})

			//3. Click 'Submit' button
			//cy.get('[name=\'save\']').should('be.enabled').click()
			cy.get('[type=\'submit\']').should('be.enabled').click()
		})
	})
})