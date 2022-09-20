describe('Reference Group', () => {
	it('Login page', () => {
		cy.visit('http://content.dev.int.thomsonreuters.com:8081/user/login/qa')
		cy.get('#username').type('555555')
		cy.get('#password').type('testuser')

		/*	1. the button should be enabled, 
			2. the get statement yields the enabled button, on which the user performs click action */
		cy.get('[type=\'submit\']').should('be.enabled').then(($button) => {
			$button.click();
		})
	})

	xit('Validate user login', () => {
		cy.url().should('eq', 'http://content.dev.int.thomsonreuters.com:8081/')
		cy.get('button.dropdown-toggle i.bento-icon-caret-down.user-caret-icon-down').click()

		/*	validate logged in user
			we should use invoke method to get the text 
		*/
		cy.get('h4.h2', { timeout: 6000 }).invoke('text').then((logginUserText) => {
			expect(logginUserText).to.equal('Test Admin')
			cy.log(logginUserText)
		})
		cy.get('button.dropdown-toggle i.bento-icon-caret-down.user-caret-icon-down').click()
	})

	describe('Create & Update Reference Group', () => {

		it('Navigate to reference-groups page', () => {

			//1. Click 'Groups' menu

			/*
				cy.get('ul li:nth-child(6) button[role=\'menuitem\'] span:nth-child(1)').click()
				//get 'Groups' menu item text
				cy.get('ul li:nth-child(6) button[role=\'menuitem\'] span:nth-child(1)').invoke('text').then((menuItemName) => {
					cy.log(menuItemName)
			})

			*/
			

			/* 
				1. get the list of li elements
				2. loop through each li element, within this li elemnt
				3. get the text of the element to click
				4. if the 'Groups' menu matches, then click and come out of loop
			*/
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

			//2. Click Reference Groups down arrow button
			cy.get('a[id=\'Reference Groups\'] a[class=\'dropdown-toggle-split dropdown-toggle\']', {timeout: 3000}).click()

			//3. Click "Create New" button
			cy.get('a[href=\'/groups/reference-groups/add\']').click()

			//4. Verify whether user is in create page
			//Method1:- 
			//cy.url().should('include', '/groups/reference-groups/add')

			//Method2:- 
			cy.get('tdr-app breadcrumb li:nth-child(3) a', {timeout: 30000}).invoke('attr', 'href').then((hrefValue) => {
				expect(hrefValue).to.equal('/groups/reference-groups/add')
				cy.log(hrefValue)			
			})

			//Method3:- 
			//cy.get('tdr-app breadcrumb li:nth-child(3) a', {timeout: 30000}).invoke('attr', 'href').should('eq', '/groups/reference-groups/add')						
		})

		it('Create', () => {

			//Header section
			cy.get('#name').type('Test_RG_13')	
			cy.get('#startDate').type('09/13/2022')	//Todo:- Get todays date, write a function
			cy.get('#description').type('test ref group description')

			//Sub-collection section
			//1. Reference Items
			//Get 2nd row,  
			cy.get('reference-item-grid div[role=\'row\']:nth-child(2)').within(() => { //within the 2nd row,
				cy.get('.wj-cell.wj-new[role=\'gridcell\']').should('have.length', 3)
				
				/* //Iterate through each column
				   //Note:- loop is applicable here, because it column has different elements
				cy.get('.wj-cell.wj-new[role=\'gridcell\']').each(($column) => {
					cy.wrap($column).dblclick()
					cy.get('input').type('Bread')

				}) */

				cy.get('.wj-cell.wj-new[role=\'gridcell\']').eq(0).dblclick() //Value
				cy.get('input').type('Bread')
				cy.get('.wj-cell.wj-new[role=\'gridcell\']').eq(1).dblclick() //Start Date
				cy.get('input[name=\'startDate\']').type('09/13/2022')
			})

			//Click outside of reference item grid, to add the data row
			cy.get('collapse-wrapper[ng-reflect-title*= \'Reference Items\']').click()

			//2. Publication Tags
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

			cy.wait(3000)

			//cy.get('[name=\'reset_button\']').scrollIntoView().should('be.visible')
			//cy.get('[name=\'reset_button\']').click()

			//3. Click 'Create Reference Group' button
			cy.get('[name=\'save\']').click()

			//4. verify user is in update page
			//4.1 validate url
			cy.url().should('include', '/groups/reference-groups/update')

			//4.2 validate created data
			cy.get('#name').should('have.value', 'Test_RG_13')
			cy.get('#startDate').should('have.value', '09/13/2022')	//Todo:- Get todays date, write a function
			cy.get('#description').should('have.value', 'test ref group description')


			//Use this when we have array of data
			//Note:- what if there are more than one row of data, use another loop for row
			cy.get('reference-item-grid div[role=\'row\']:nth-child(3) .wj-cell[role=\'gridcell\']').each(($column) => {
					cy.wrap($column).invoke('text').then((textInEachColumn) => {
						cy.log(textInEachColumn)
						expect(textInEachColumn).to.equal('To Do:-') //To do:- 
					})		
				
			})

			cy.get('reference-item-grid div[role=\'row\']:nth-child(3) .wj-cell[role=\'gridcell\']').eq(0).invoke('text').then((textInEachColumn) => {
						cy.log(textInEachColumn)
						expect(textInEachColumn).to.equal('Bread') 
					})	

			cy.get('reference-item-grid div[role=\'row\']:nth-child(3) .wj-cell[role=\'gridcell\']').eq(1).invoke('text').then((textInEachColumn) => {
						cy.log(textInEachColumn)
						expect(textInEachColumn).to.equal('09/13/2022') 
					})		
			

			//4.3 verify revisions grid and its columns
			
			
		})
	})
})