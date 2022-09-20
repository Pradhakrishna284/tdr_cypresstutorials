describe('Operating License Type Mappings', () => {

	before(() => {
		
	})

	it('Login page', () => {
		cy.visit('http://content.dev.int.thomsonreuters.com:8081/user/login/qa')
		cy.get('#username').type('333333')
		cy.get('#password').type('testuser')
		cy.get('[type=\'submit\']').should('be.enabled').click()
	})

	it('Navigate to OLTM page', () => {

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

		//2. Click OLTM tab
		cy.get('a[id=\'Operating License Type Mappings\']', { timeout: 3000 }).click()

		//3. Verify whether user is in oltm page
		cy.url().should('include', '/groups/operating-license')

		interceptAPIRequests()
		searchWithEntity('seller', 'USUV (US-US-UNITED STATES)', 'interceptOLTM')
		//searchWithEntity('buyer', 'AKSGOVT (AK-02-ALASKA)', 'interceptOLTM')
		//searchWithEntity('jurisdiction', 'US - OIL AND GAS FEDERAL EXCISE TAX', 'interceptJurisdiction')
		//searchWithEntity('commodity', 'Marine Diesel Oil [FTA 279]', 'interceptCommidity')		
	})

	xit('searchWithSeller', () => {

		interceptAPIRequests()
		cy.reload() 
		searchWithEntity('seller', 'USUV (US-US-UNITED STATES)', 'interceptOLTM')	
	})

	xit('searchWithBuyer', () => {

		interceptAPIRequests()
		cy.reload() 
		searchWithEntity('buyer', 'USEC (US-US-UNITED STATES)', 'interceptOLTM')	
	})

	xit('searchWithJurisdiction', () => {

		interceptAPIRequests()
		cy.reload() 
		searchWithEntity('jurisdiction', 'US - OIL AND GAS FEDERAL EXCISE TAX', 'interceptJurisdiction')	
	})

	xit('searchWithCommodity', () => {

		interceptAPIRequests()
		cy.reload() //use this for using intercepts and to solve detached element DOM

		//https://www.cypress.io/blog/2020/07/22/do-not-get-too-detached/
		//https://www.youtube.com/watch?v=VPznmFpa1Jc
		searchWithEntity('commodity', 'Marine Diesel Oil [FTA 279]', 'interceptCommidity')	
	})

	function interceptAPIRequests() {

		interceptOLTMViewsReq()
		interceptJurisViewsReq()
		interceptCommoditiesReq()
	}

	function interceptOLTMViewsReq() {
		cy.intercept('GET', '/api/OperatingLicenseTypesViews**').as('interceptOLTM')
	}

	function interceptCommoditiesReq() {
		cy.intercept('GET', '/api/commodities**').as('interceptCommidity')
	}

	function interceptJurisViewsReq() {
		cy.intercept('GET', '/api/JurisdictionViews**').as('interceptJurisdiction')
	}
	
	function searchWithEntity(entity, entityName, intercept) {

		cy.log(`name=\'${entity}\'`)
		let element = `\'${entity}\'`
		cy.log(element)
		cy.log(entityName)
		cy.log(intercept)

		//https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html

		//Commodity
		cy.get(`bento-combobox[name=\'${entity}\'] input[role=\'combobox\']`).click()
				 
		// flake solution: wait for the widget to load the initial set of commodities
		cy.get('div.bento-list-row div:nth-child(1)', { timeout: 10000 })
			//.should('have.length.gt', 3)
			.should('be.visible')
			.as('entitiesList')

		// then type into the input element to trigger search, and wait for results
		// also avoid typing "enter" as it "locks" the selection
		cy.get(`bento-combobox[name=\'${entity}\'] input[role=\'combobox\']`).type(entityName)
		cy.wait(1000)

		cy.wait(`@${intercept}`)

		// flake solution: wait for the search for "clem" to finish
		cy.get('@entitiesList').should('have.length.gt', 1)

		cy.contains('div.bento-list-row', entityName)
			.should('be.visible')
			.click({force:true})

		// confirm combobox renders the commodity
		cy.get(`bento-combobox[name=\'${entity}\'] input[role=\'combobox\']`)
			.invoke('val').then((selectedEntityName) => {
				expect(selectedEntityName).to.equal(entityName)
			})

		cy.get('button[type=\'submit\']').click() 

		//https://filiphric.com/waiting-in-cypress-and-how-to-avoid-it

		cy.get('wj-flex-grid.bento-flex-grid', {timeout:60000})
			.should('be.visible')
			.scrollIntoView()
			.viewport(1500, 660) //set the size of the grid
			
		// cy.get('wj-flex-grid.bento-flex-grid div[role=\'row\']')
		// 	.should('have.length.greaterThan', 2)

		cy.get('wj-flex-grid.bento-flex-grid')
			.find('div[role=\'row\']')
			.should('have.length.greaterThan', 2)

		/*
		//https://docs.cypress.io/api/commands/scrollto#Options
		//cy.window().invoke('scrollTop').should('eq', 100)
		cy.get('wj-flex-grid.bento-flex-grid').scrollTo('bottom', { ensureScrollable: false })
		cy.wait(10000)
		cy.window().scrollTo('bottom', { ensureScrollable: false })
		cy.wait(10000)*/

		//Note:- The grid is jumping, unable to perform actions.
	}

	/*
		To Do's:- 
		1. Create OLTM
		2. Update OLTM
	*/

	function dummySnippets(entityName) {

		cy.get('bento-combobox[name=\'buyer\'] div[class=\'bento-combobox-container\'] div.bento-list-row.bento-combobox-container-item.highlighted.ng-star-inserted')
			.should($item => { expect(Cypress.dom.isDetached($item)).to.equal(false); })
			.should('be.visible')
			.click()

	}

})