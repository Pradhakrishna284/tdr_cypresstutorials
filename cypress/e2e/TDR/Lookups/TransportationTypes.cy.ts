import {slowCypressDown} from 'cypress-slow-down'
//slowCypressDown() //delay by a second
//slowCypressDown(300)
//slowCypressDown(false) //does not delay
//We can use it in a particular it block

describe('Transportation Types', () => {

	it('Login page', { baseUrl: 'http://content.qa.int.thomsonreuters.com:8081' }, 
		() => {
		cy.visit('/user/login/qa')
		cy.get('#username').type('333333')
		cy.get('#password').type('testuser')
		cy.get('[type=\'submit\']').should('be.enabled').click()		
	})

	it('Navigate to Transporation types page', () => {

		let shouldStop = false
		//Click Lookups menu
		cy.get('ul li[bentotoolbaritem] button[role=\'menuitem\'] span:nth-child(1)', { timeout: 60000 })
			.each(($menuItem) => { //within this li elements
				cy.then(() => {
					if (shouldStop) {
						return
					}
					cy.wrap($menuItem).invoke('text').then((menuName) => {
						if (menuName == 'Lookups') {
							cy.wrap($menuItem).click()
							cy.log(`User clicked ${menuName} menu`)
							shouldStop = true //breaks the each loop
						}
					})
				})			
			})

		//2. Verify whether user is in transportation types page
		cy.url().should('include', '/lookups/transportation-types')
	})

	describe('Search', () => {
		it('Search By Name', () => {
			search("name", "Test_TT_16")
		})

		it('Search By Description', () => {
			search("Description", "test desc Test_TT_16")
		})

		it('Search By Bulk Designation', () => {
			search("Bulk Designation", "Y")
		})

		it('Search By Start Date', () => {
			search("Start Date", "01/01/2000")
		})
	})

	describe('Pagination', () => {		
		//slowCypressDown(300)

		//Iterate through pages and display count of records in each page
		it('Iterate through pages when grid display count is 10', () => {
			pagination("10")		
		})

		//The page is not scrolling down, need proper code to fix it.
		it('Iterate through pages when grid display count is 50', () => {
			pagination("50")		
		})

		it('Iterate through pages when grid display count is 100', () => {
			pagination("100")		
		})

		it('Iterate through pages when grid display count is 9999', () => {
			pagination("9999")		
		})
	})

	function viewGrid() {
		cy.get('wj-flex-grid.bento-flex-grid', { timeout: 30000 })
			.scrollIntoView()
			.should('be.visible') //Assert element is visible after scrolling it into view		
	}

	function search(headerName: string, valueToSearch: string) {

		//1. View the grid to full size
		viewGrid() 		
		
		cy.get('div[wj-part=\'ch\'] div[class=\'wj-row\'] div.wj-cell')
			.should('be.visible').and('have.length', 7) //assert no. of columns

		//Get the column index		
		cy.get('div[wj-part=\'ch\'] div[class=\'wj-row\'] div.wj-cell').contains(headerName)
			.invoke('index')
			.then((columnIndex) => {
				columnIndex = columnIndex + 1
				cy.log(`The column index is **${columnIndex}**`)

				//2. Click on selected column header arrow, and filter
				cy.get('div[wj-part=\'ch\'] div[class=\'wj-row\'] div.wj-cell:nth-child(' + columnIndex + ') span', { timeout: 5000 })
					.click({ force: true }) //click arrow
				cy.get('input[type=\'text\']').should('be.visible').then(($textbox) => {
					cy.wrap($textbox).type(valueToSearch).then(() => {
						cy.wait(1000)
						cy.get('a[wj-part="btn-apply"]').click()
					})			
				})
				
				//3. View the grid to full size	
				viewGrid() 		

				//validate the row count
				cy.get('wj-flex-grid.bento-flex-grid div[role=\'row\']')
					.should('have.length.gte', 3)

				//4. Verify the expected entity/value in grid result
				let isPresent: boolean = false

				//1. Since we get the filtered entity in the 3rd row of the grid, we can use 3rd row 
				// directly for all columns
				//2. For Bulk Designation, Start & End Date, columns, the data would be same 
				// across all rows so, the below logic will also be correct
				cy.get('wj-flex-grid.bento-flex-grid div[role="row"]:nth-child(3)').within(() => {
					cy.get('div[role=\'gridcell\']:nth-child(' + columnIndex + ')')
						.invoke('text').then((name) => { //specific column
							if (name == valueToSearch) {						
								isPresent = true
								cy.wrap(isPresent).as('isEntityPresent')
								cy.wrap(name).as('expectedValue')
								cy.log(`Searched value is ${name}`)
								return false
							}	
						})
				})
				
				cy.get('@isEntityPresent').should('equal', true)
				cy.get('@expectedValue').should('equal', valueToSearch)

				//5. After validation, remove the filter option in the column
				cy.get('div[wj-part=\'ch\'] div[class=\'wj-row\'] div.wj-cell:nth-child(' + columnIndex + ') span', { timeout: 5000 })
					.click({ force: true }) //click arrow
				cy.get('input[type=\'text\']').should('be.visible').then(($textbox) => {
					cy.wrap($textbox).clear().then(() => {
						cy.wait(1500)
						cy.get('a[wj-part="btn-apply"]').click()
					})			
				})

			})
	}

	function pagination(displayCount: string) {
		cy.get('pagination:nth-child(1) > bento-pagination:nth-child(1) > div:nth-child(1) > div:nth-child(1) div.bento-select select[bentoselect]')
			.select(displayCount)

		cy.wait(1000)

		viewGrid()
		goToNextPage()

		let count = 0
		function goToNextPage() {
			cy.get('wj-flex-grid.bento-flex-grid div[role=\'row\']').should('have.length.gte', 3)
				.its('length').then(n => {
					count += n - 2 //remove header row and first row(empty row)

				})

			cy.get('pagination:nth-child(1) .bento-pagination div[bento-test="next-button"] > button')
				.invoke('attr', 'disabled')
				.then((getAttribute) => {
					if (getAttribute == 'disabled') {
						cy.log(`End of pagination : ${count} rows`)
					}
					else {
						cy.wait(1000)
						cy.get('pagination:nth-child(1) .bento-pagination div[bento-test="next-button"] > button')
							.click()
							.then(goToNextPage)
					}

				})
		}
	}


})