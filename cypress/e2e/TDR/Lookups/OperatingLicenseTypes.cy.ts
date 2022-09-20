describe('Operating License Types', () => {
	it('Login page', () => {
		cy.visit('http://content.dev.int.thomsonreuters.com:8081/user/login/qa')
		cy.get('#username').type('333333')
		cy.get('#password').type('testuser')
		cy.get('[type=\'submit\']').should('be.enabled').click()
	})

	it('Navigate to Operating License page', () => {
		//Click Lookups menu
		//Click Lookups menu
		cy.get('ul li[bentotoolbaritem] button[role=\'menuitem\'] span:nth-child(1)', { timeout: 60000 })
			.each(($menuItem) => { //within this li elements
				
			cy.wrap($menuItem).invoke('text').then((menuName) => {
				if (menuName == 'Lookups') {
					cy.wrap($menuItem).click()
					cy.log(`User clicked ${menuName} menu`)
					return false //breaks the each loop
				}
			})
		})

		//2. Click OLTM tab
		cy.get('a[id=\'Operating License Types\']', { timeout: 3000 }).click()

		//3. Verify whether user is in oltm page
		cy.url().should('include', '/lookups/operating-license-types')
	})

	it('Create', () => {
		
		cy.get('wj-flex-grid.bento-flex-grid', { timeout: 30000 })
			//.should('be.visible')
			.scrollIntoView({ easing: 'linear' })
			.should('be.visible') 
			.viewport(1500, 660) 

		const arrayOperLicense = ["Test_OLT_16", "Test_OLT_Desc", "NM-35-NEW MEXICO", "09/16/2022"]
		cy.get('wj-flex-grid.bento-flex-grid div[role=\'row\']:nth-child(2)', {timeout:30000}) //find 2nd row
			.within(() => { //within the row
				cy.get('div[role=\'gridcell\']', {timeout:30000}).each(($column) => { //loop through each column
					cy.log($column.index().toString(10))
					if ($column.index() < 4) { // we are entering only 4 column values
							cy.wrap($column).dblclick().then(() => {
							cy.wait(10000) //remove later, desc and boundary control is jumping, so to test the functionality I haved added wait
							if($column.index() == 3)
								cy.get('input[type=\'tel\']', {timeout:2000}).type(arrayOperLicense[$column.index()])
							else
								cy.get('input[type=\'text\']', {timeout:2000}).type(arrayOperLicense[$column.index()])
						})
					}
					else	
						return false //come out of column loop			
				})
			})

		//Click outside of grid to save data
		cy.get('bento-toolbar[role="toolbar"]').click({force:true})

		//Todo:-  validate success message
	})
})