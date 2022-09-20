describe('Search Jurisdiction Type', () => {
	it('Login page', () => {
		cy.visit('http://content.dev.int.thomsonreuters.com:8081/user/login/qa')
		cy.get('#username').type('555555')
		cy.get('#password').type('testuser')
		cy.get('[type=\'submit\']').should('be.enabled').click()
	})

	it('Search', () => {
		//Navigate to jurisdiction type search page

		//Click Groups menu
		cy.get('ul li[bentotoolbaritem] button[role=\'menuitem\'] span:nth-child(1)').each(($menuItem) => {
			//within this li elements
			cy.wrap($menuItem).invoke('text').then((menuName) => {
				if (menuName == 'Groups') {
					cy.log(menuName)
					cy.wrap($menuItem).click()
					cy.log('User clicked ' + menuName + "Menu")
					return false //breaks the each loop
				}
			})
		})

		//2. Click Jurisdiction Types down arrow button
		cy.get('a[id=\'Jurisdiction Types\'] a[class=\'dropdown-toggle-split dropdown-toggle\']', {timeout:3000}).click()

		//3. Click 'Search' tab
		cy.get('a.dropdown-item.ng-star-inserted[ng-reflect-router-link=\'./jurisdiction-types\']').click()

		cy.get('input[name=\'searchTerm\']').type('Test_JT_14')
		cy.get('button.search_button i.bento-icon-search').click() //Search

		cy.get('wj-flex-grid.bento-flex-grid', {timeout:60000}).should('be.visible')

		cy.get('wj-flex-grid.bento-flex-grid div[role=\'row\']:nth-child(2) div[role=\'gridcell\']:nth-child(1) a').then(($textToClick) => {
			if ($textToClick.text() == 'Test_JT_14') {
				cy.log($textToClick.text())
				cy.get('wj-flex-grid.bento-flex-grid div[role=\'row\']:nth-child(2) div[role=\'gridcell\']:nth-child(1) a').click()
				cy.log('After click')
				//$textToClick.click()
			}
			else
				cy.log('Incorrect or no jurisdiction type is displayed! Try again with correct search data')
		})

		//4. Verify user lands in update page
		cy.url({timeout:60000}).should('include', '/groups/jurisdiction-types').and('include', '/upd')
	})
})