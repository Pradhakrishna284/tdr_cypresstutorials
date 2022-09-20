describe('Logic Group', () => {

	it('Login page', () => {
		cy.visit('http://content.dev.int.thomsonreuters.com:8081/user/login/qa')
		cy.get('#username').type('555555')
		cy.get('#password').type('testuser')
		cy.get('[type=\'submit\']').should('be.enabled').click()
	})


describe('Create & Update Logic Group', () => {

		it('Navigate to logic group page', () => {

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

			//2. Click Logic Groups down arrow button
			cy.get('a[id=\'Logic Groups\'] a[class=\'dropdown-toggle-split dropdown-toggle\']', {timeout: 3000}).click()

			//3. Click "Create New" button
			cy.get('a[href=\'/groups/logic-groups/add\']').click()

			//4. Verify whether user is in create page
			cy.url().should('include', '/groups/logic-groups/add')
		})

		it('Create', () => {

			//Header section
			cy.get('#name').type('Test_LG_14')	
			//cy.get('#startDate').type('09/14/2022')	//Todo:- Get todays date, write a function
			
			//1. Elements
			//Get 2nd row,  
			cy.get('wj-flex-grid[id=\'logicElementGrid\'] div[role=\'grid\'] div[role=\'row\']:nth-child(2)').within(() => { //within the 2nd row,
				cy.get('[role=\'gridcell\']').should('have.length', 5)

				cy.get('[role=\'gridcell\']').eq(0).dblclick() //Role
				cy.get('input').type('Buyer')

				cy.get('[role=\'gridcell\']').eq(1).dblclick() //Transaction Type
				cy.get('input').type('Rental')

				cy.get('[role=\'gridcell\']').eq(2).dblclick() //Start Date
				cy.get('input[name=\'startDate\']').type('09/14/2022')

				cy.get('[role=\'gridcell\']').eq(4).dblclick() //Logic Element
				cy.get('input').type('com.sabrix.tax.jurisdiction.UsArizonaBuyerGoodsStateJe')
			})

			//Click outside of elements grid, to add the data row
			cy.get('collapse-wrapper[ng-reflect-title^= \'Elements(JE\']').click()

			//2. Publication Tags
			let arrayPublicationTags: string[] = ['Determination', 'United States', 'Mid/Downstream']

			arrayPublicationTags.forEach(function (value) {				
				//Click 2nd row
				cy.get('publication-grid div[role=\'row\']:nth-child(2) div[role=\'gridcell\']', {timeout: 3000}).dblclick().within(() => {
					cy.get('input').type(value)
				})
								
				//Click outside of publication tags grid, to add the data row
				//cy.get('collapse-wrapper[ng-reflect-title^= \'Publication Tags\']', {timeout: 3000}).click()	
				cy.get('#name').click()
				cy.wait(1000)
			})

			cy.wait(2000)
			//3. Click 'Create Logic Group' button
			cy.get('[name=\'save\']').should('be.enabled')
			cy.get('[name=\'save\']').focus().click()
			

/*
			//4. verify user is in update page
			//4.1 validate url
			cy.url().should('include', '/groups/logic-groups/update')

			//4.2 validate created data
			cy.get('#name').should('have.value', 'Test_LG_14')
			cy.get('#startDate').should('have.value', '09/14/2022')
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
			
			*/
		})
	})
})