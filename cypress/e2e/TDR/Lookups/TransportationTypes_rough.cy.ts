describe('Transporation Types', () => {

	beforeEach(() => {
		// run these tests as if in a desktop
		// browser with a 720p monitor
		//cy.viewport(1920, 1080)      
	})

	xit('tests', () => {
		cy.visit('https://legacy.datatables.net/release-datatables/examples/basic_init/scroll_y_infinite.html')
		cy.get('.dataTables_scroll').scrollIntoView().within(() => {
			cy.get('tbody>tr').should('have.length', 10)
			cy.get('.dataTables_scrollBody').scrollTo('bottom')
			cy.get('tbody>tr').should('have.length', 20)
			cy.get('.dataTables_scrollBody').scrollTo('bottom')
			cy.get('tbody>tr').should('have.length', 30)
			cy.get('.dataTables_scrollBody').scrollTo('bottom')
			cy.get('tbody>tr').should('have.length', 40)
			cy.get('tbody>tr').eq(39).should('contain', 'Presto')
		})
	})

	it('Login page', () => {
		cy.visit('http://content.qa.int.thomsonreuters.com:8081/user/login/qa')
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

	
	xit('Create', () => {
		
		// cy.get('wj-flex-grid.bento-flex-grid', { timeout: 30000 })
		// 	.should('be.visible')
		// 	.scrollIntoView()
		// 	.viewport(1500, 660)

		viewGrid()

		const arraycreateTransport = ["Test_TT_16", "Test_TT_Desc", "N", "09/16/2022"]
		cy.get('wj-flex-grid.bento-flex-grid div[role=\'row\']:nth-child(2)', { timeout: 30000 }) //find 2nd row
			.within(() => { //within the row
				cy.get('div[role=\'gridcell\']').each(($cellData, index, $columns) => { //loop through each column
					cy.log($cellData.index().toString(10))
					if ($cellData.index() < 4) { // we are entering only 4 column values
						cy.wrap($cellData).dblclick({ scrollBehavior: false }).then(() => {
							//remove later, desc control is jumping, so to test the functionality I haved added wait
							cy.wait(3500) 
							
							if ($cellData.index() == 3)
								cy.get('input[type=\'tel\']', { timeout: 2000 }).type(arraycreateTransport[$cellData.index()])
							else
								cy.get('input[type=\'text\']', { timeout: 2000 }).type(arraycreateTransport[$cellData.index()])
						})
					}
					else	
						return false //come out of column loop					
				})
			})

		//Click outside of grid to save data
		cy.get('bento-toolbar[role="toolbar"]').click({ force: true })

		//Todo:-  and validate success message
	})

	xit('Validate the newly created data', () => {
		//1. In the grid, filter by name and click
		search("name", "Test_TT_16")

		//2. validate url

		//3. validate text in the update page
	})

	function search(headerName, valueToSearch) {

		//1. View the grid to full size
		viewGrid() 		
		
		cy.get('div[wj-part=\'ch\'] div[class=\'wj-row\'] div.wj-cell')
			.should('be.visible').and('have.length', 7) //assert no. of columns
		
				/*
					Currently, I am unable to get the index value outside of { }
				*/
				//With the below url, I am able to get hold of column index and use it outside of { }
				//https://www.youtube.com/watch?v=Csjg1qktnU0
				//Get the column index based on column name
				let columnIndex = 0
				cy.get('div[wj-part=\'ch\'] div[class=\'wj-row\'] div.wj-cell').each(($cellData, index, $columns) => {
					cy.wrap($cellData).then((columnText) => { //single cell
						//cy.log(columnText.text())
						if(columnText.text() == headerName) {
							cy.task('save', index + 1) 
							// cy.log(`${columnText.text()} is at index ${columnIndex}`)
							// cy.wrap(columnIndex).as('columnIndex')
							return false
						}
					})			
				})

				cy.task('load').then((columnIndex) => {

					//2. Click on selected column header arrow, and filter
				cy.get('div[wj-part=\'ch\'] div[class=\'wj-row\'] div.wj-cell:nth-child(' + columnIndex + ') span', { timeout: 5000 })
					.click({ force: true }) //click arrow
				cy.get('input[type=\'text\']').should('be.visible').then(($textbox) => {
					cy.wrap($textbox).type(valueToSearch).then(() => {
						cy.wait(1000)
						cy.get('a[wj-part="btn-apply"]').click()
					})			
				})

				})				
				
	}

	function search1(headerName, valueToSearch) {

		//1. View the grid to full size
		viewGrid() 		
		
		cy.get('div[wj-part=\'ch\'] div[class=\'wj-row\'] div.wj-cell')
			.should('be.visible').and('have.length', 7) //assert no. of columns

		//Get the column index
		//https://glebbahmutov.com/cypress-examples/9.7.0/recipes/table-cell-by-column-heading.html#find-a-specific-cell
		//https://www.youtube.com/watch?v=8UhoGJEe4NY&list=PLP9o9QNnQuAYYRpJzDNWpeuOVTwxmIxcI&index=2
		cy.get('div[wj-part=\'ch\'] div[class=\'wj-row\'] div.wj-cell').contains(headerName)
			.invoke('index')
			.then((columnIndex) => {
				columnIndex = columnIndex + 1
				cy.log(`The column index is ${columnIndex}`)

				//2. Click on selected column header arrow, and filter
				cy.get('div[wj-part=\'ch\'] div[class=\'wj-row\'] div.wj-cell:nth-child(' + columnIndex + ') span', { timeout: 5000 })
					.click({ force: true }) //click arrow
				cy.get('input[type=\'text\']').should('be.visible').then(($textbox) => {
					cy.wrap($textbox).type(valueToSearch).then(() => {
						cy.wait(1000)
						cy.get('a[wj-part="btn-apply"]').click()
					})			
				})
				//})

				cy.log("=======================================================================")

				/*
					Currently, I am unable to get the index value outside of { }
				*/
				// //Get the column index based on column name
				// let columnIndex = 0
				// cy.get('div[wj-part=\'ch\'] div[class=\'wj-row\'] div.wj-cell').each(($cellData, index, $columns) => {

				// 	//Note:- Observe the difference, between the commented line and other line.
				// 	//cy.wrap($cellData).invoke('text').then(($columnText) => { //single cell
				// 	cy.wrap($cellData).then((columnText) => { //single cell
				// 		cy.log(columnText.text())
				// 		if(columnText.text() == headerName) {
				// 			columnIndex = index + 1
				// 			cy.log(`${columnText.text()} is at index ${columnIndex}`)
				// 			cy.wrap(columnIndex).as('columnIndex')
				// 			return false
				// 		}
				// 	})			
				// })

				// cy.get('@columnIndex').then((indexValue) => {
				// 	cy.log(`Index value after appending is ${indexValue}`)
				// })

				// //2. Click on selected column header arrow, and filter
				// cy.get('div[wj-part=\'ch\'] div[class=\'wj-row\'] div.wj-cell:nth-child(' + columnIndex + ') span', { timeout: 5000 })
				// 	.click({ force: true }) //click arrow
				// cy.get('input[type=\'text\']').should('be.visible').then(($textbox) => {
				// 	cy.wrap($textbox).type(valueToSearch).then(() => {
				// 		cy.wait(1000)
				// 		cy.get('a[wj-part="btn-apply"]').click()
				// 	})			
				// })

				//3. View the grid to full size	
				viewGrid() 		

				//validate the row count
				cy.get('wj-flex-grid.bento-flex-grid div[role=\'row\']')
					.should('have.length.gte', 3)

				//4. Verify the above entity in grid result
				//4. Way 1:-
				let isPresent: boolean = false

				//Since we get the filtered entity in the 3rd row of the grid, we can use 3rd row directly for all columns
				//For Bulk Designation, Start & End Date, columns, the data would be same across all rows
				//so, the below logic will also be correct
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
				
				// //Iterate through each row
				// cy.get('wj-flex-grid.bento-flex-grid div[role=\'row\']', { timeout: 30000 }).each(($row, index, $rows) => {
				// 	cy.wrap($row).within(() => { //within the selected row				
				// 		if (index > 1) {
				// 			cy.get('div[role=\'gridcell\']:nth-child(' + columnIndex + ')').invoke('text').then((name) => { //first column
				// 				if (name == valueToSearch) {						
				// 					isPresent = true
				// 					cy.wrap(isPresent).as('isEntityPresent')
				// 					cy.wrap(name).as('expectedValue')
				// 					cy.log(`Searched value is ${name}`)
				// 					return false
				// 				}	
				// 			})
				// 		}				
				// 	})				
				// })	

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

	xit('Update', () => {
		//Note:- this test case should immediately be after 'Validate the newly created data' test case
	})

	it('Search By Name', () => {

		search("name", "Test_TT_16")

	})

	xit('Search By Description', () => {

		search("Description", "test desc Test_TT_16")

	})

	xit('Search By Bulk Designation', () => {

		search("Bulk Designation", "Y")

	})

	xit('Search By Start Date', () => {

		search("Start Date", "01/01/2000")

	})


	/*	1. Search by Name is completed, 
		2. implement for other columns
		3. Use parameterized[send column name] common function
		4. For Bulk Designation, Start Date and End Date, just validate the row count >= 3
		5. For Published column, use contains to validate and the row count >= 3
	*/
	xit('Search by Name', () => {

		//1. View the grid to full size
		viewGrid() 		

		
		cy.get('div[wj-part=\'ch\'] div[class=\'wj-row\'] div.wj-cell')
			.should('be.visible')
			.and('have.length', 7) //assert no. of columns

		//Try to use children syntax, https://docs.cypress.io/api/commands/children#No-Args 
		cy.get('div[wj-part=\'ch\'] div[class=\'wj-row\']')
			.children()
			.should('be.visible')
			.and('have.length', 7) //assert no. of columns

		//2. Click on first column arrow, and filter the entity name
		cy.get('div[wj-part=\'ch\'] div[class=\'wj-row\'] div.wj-cell:nth-child(1) span', { timeout: 5000 })
			.click({ force: true }) //click arrow
		cy.get('input[type=\'text\']').should('be.visible').then(($textbox) => {
			cy.wrap($textbox).type('Test_TT_16').then(() => {
				cy.wait(1000)
				cy.get('a[wj-part="btn-apply"]').click()
			})			
		})

		//3. View the grid to full size	
		viewGrid() 		

		//validate the row count
		cy.get('wj-flex-grid.bento-flex-grid div[role=\'row\']')
			.should('have.length.gte', 3)

		//4. Verify the above entity in grid result
		//4. Way 1:-
		var isPresent: boolean = false
		//Iterate through each row
		cy.get('wj-flex-grid.bento-flex-grid div[role=\'row\']', { timeout: 30000 }).each((row, index) => {
			cy.wrap(row).within(() => { //within the selected row				
				if (index > 1) {
					cy.get('div[role=\'gridcell\']:nth-child(1)').invoke('text').then((name) => { //first column
						cy.log("First column value:- " + name)
						if (name == "Test_TT_16") {						
							isPresent = true
							cy.wrap(isPresent).as('isEntityPresent')
							return false
						}	
					})
				}				
			})				
		})	
		cy.get('@isEntityPresent').should('equal', true)

		//4. Way2:- 
		//Usuage of href, https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#Subject-Management
		cy.get('wj-flex-grid.bento-flex-grid div[role=\'row\']:nth-child(3) div[role=\'gridcell\']:nth-child(1)')
			.invoke('text').then(($text) => {
				expect($text).to.equal("Test_TT_16")
			})

		//4. Way3:- 
		cy.get('wj-flex-grid.bento-flex-grid div[role=\'row\']:nth-child(3) div[role=\'gridcell\']:nth-child(1)')
			.should('contain', "Test_TT_16")

		//5. After validation, remove the filter option in the column
		//Click on first column arrow, and filter the entity name
		cy.get('div[wj-part=\'ch\'] div[class=\'wj-row\'] div.wj-cell:nth-child(1) span', { timeout: 5000 })
			.click({ force: true }) //click arrow
		cy.get('input[type=\'text\']').should('be.visible').then(($textbox) => {
			cy.wrap($textbox).clear().then(() => {
				cy.wait(1500)
				cy.get('a[wj-part="btn-apply"]').click()
			})			
		})

	})

	xit('Pagination', () => {

		//cy.wait(5000)

		viewGrid()

		cy.get('pagination:nth-child(1) > bento-pagination:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(6) > div:nth-child(1) > select:nth-child(1)')
			.should('have.value', 10)
		cy.get('pagination:nth-child(1) > bento-pagination:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(6) > div:nth-child(1) > select:nth-child(1)')
			.select('9999')
		
		cy.wait(5000)

		//get the count of records in the grid 
		cy.get('pagination:nth-child(1) bento-pagination:nth-child(1) div:nth-child(1) div:nth-child(2) div:nth-child(2) span:nth-child(1)')
			.invoke('text').then(($noOfRecords) => {

			})

		//loop through each row
		//for each row, get first column and click on it
		//scroll down
		//https://www.codegrepper.com/code-examples/javascript/jquery+iterate+through+table+rows
		//https://codepedia.info/use-jquery-each-method-loop
		//https://www.youtube.com/watch?v=M0RxEeJaq_E
		//https://www.youtube.com/watch?v=_vqOtLIGI9o
		//https://github.com/cypress-io/cypress/issues/6201

		/*
			//https://github.com/cypress-io/cypress/issues/6201
			Note:- We cannot use, scrollInToView() method on all the rows of the grid, we get error, 
			instead we have to use the method on individual row
		*/
		// cy.get('wj-flex-grid.bento-flex-grid div[wj-part="root"] div[role=\'row\']', { timeout: 30000 }).each((row, index) => {
		// 	cy.wrap(row).scrollIntoView().within(() => { //within the selected row

		// 		if (index > 1) {
		// 			cy.get('div[role=\'gridcell\']:nth-child(1)').invoke('text').then((name) => {
		// 				cy.log("First column value:- " + name)
		// 				if (name == "Test_TT_16") {
		// 					cy.log("Expected text present:- " + name)
		// 					return false
		// 				}
				
		// 			})
		// 		}

		// 	})	
		// 	cy.get('wj-flex-grid.bento-flex-grid div[wj-part="root"]').scrollTo('bottom')		
				
		// })

		cy.get('wj-flex-grid.bento-flex-grid div[wj-part="root"]').scrollIntoView().within(() => {
			//since data row starts from 3rd row, make index as index+2
			//get the count of records from 
			cy.get('div[role=\'row\']', { timeout: 30000 }).each(($row, $index) => {
				cy.log('Index within the loop: -' + $index)
				cy.wrap($row).within(() => { //within the selected row

					if ($index > 1) {
						cy.get('div[role=\'gridcell\']:nth-child(1)').invoke('text').then((name) => {
							cy.log("First column value:- " + name)
							if (name == "Test_TT_16") {
								cy.log("Expected text present:- " + name)
								return false
							}
				
						})
					}
				})	
				
			})
			cy.get('div[role=\'row\']').scrollTo('bottom')
		})
	})


	//https://www.youtube.com/watch?v=_vqOtLIGI9o
	xit('Iterate through pages', () => {
		viewGrid()
		goToNextPage()

		function goToNextPage() {

			cy.get('pagination:nth-child(1) .bento-pagination div[bento-test="next-button"] > button')
				.invoke('attr', 'disabled')
				.then((getAttribute) => {
					if (getAttribute == 'disabled') {
						cy.log('End of pagination')
					}
					else {
						cy.wait(1000)
						cy.get('pagination:nth-child(1) .bento-pagination div[bento-test="next-button"] > button')
							.click()
							.then(goToNextPage)
					}

				})
		}		
		
	})

	xit('Iterate through pages and count records in each page', () => {
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
		
	})

	/*
		1. It is complete, make it common function
	*/
	xit('Iterate through pages and verify the expected column value', () => {
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
						GetRows()
					}
					else {
						cy.wait(1000)
						GetRows()
						cy.get('pagination:nth-child(1) .bento-pagination div[bento-test="next-button"] > button')
							.click()
							.then(goToNextPage)
					}

				})
		}

		//https://www.webtips.dev/webtips/cypress/iterate-over-elements
		function GetRows() {
			//https://www.youtube.com/watch?v=G4xs9_cAm2c
			let shouldStop = false
			cy.get('wj-flex-grid.bento-flex-grid div[wj-part="root"] div[role=\'row\']', { timeout: 30000 })
				.each((row, index) => {
					cy.then(() => {
						if (shouldStop) {
							return
						}
						cy.log("Row:- " + index)

						//Note:- Here we can use either use scrollIntoView() method or not
						//cy.wrap(row).scrollIntoView().within(() => { //within the selected row
						cy.wrap(row).within(() => { //within the selected row
							if (index > 1) {
								cy.get('div[role=\'gridcell\']:nth-child(1)').invoke('text').then((name) => {
									if (name == "Test_TT_16") {
										//cy.log(`${name} is present in the grid`)
										expect(name).to.equal("Test_TT_16")
										shouldStop = true
									}				
								})
							}
						})
					})
				
				})
		}
		
	})

	//Sorting:- https://www.youtube.com/watch?v=21MXha13qCU
	//https://www.youtube.com/watch?v=6UQUEgfGSH0

	function viewGrid() {
		cy.get('wj-flex-grid.bento-flex-grid', { timeout: 30000 })
			//.should('be.visible')
			.scrollIntoView()
			//.scrollIntoView({ easing: 'linear' })
			.should('be.visible') //Assert element is visible after scrolling it into view
		//Note:- I set the view port in cypress.json.ts file
		//.viewport(1500, 660) //It yields null, so cannot be chained further
	}

})