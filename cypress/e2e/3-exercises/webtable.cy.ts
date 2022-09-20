describe('Handling web table', () => {
	it('web table test case', () => {
		cy.visit('https://qavbox.github.io/demo/webtable/')

		//fetching table header data
		cy.get('#table01 thead tr th').should('have.length', 4)

		//Note:- Anything that we use in each method should compulsoryly be wrapped
		cy.get('#table01 thead tr th').each(($headerElement) => {
			cy.wrap($headerElement).invoke('text').then((headerText) => {
				cy.log(headerText)
			})
			
			//cy.log($headerElement.text()) //jQuery
		})

		//no of Rows
		cy.get('#table01 tbody tr').should('have.length', 3)

		//fetch specific row data - way1
		// cy.get('#table01 tbody tr:nth-child(1) td').each(($specificRowColumnElement) => {
		// 	// cy.wrap($specificRowColumnElement).invoke('text').then((columnText) => {
		// 	// 	cy.log(columnText)
		// 	// })

		// 	cy.log($specificRowColumnElement.text())
		// })

		//way2, get particular index 		
		// cy.get('#table01 tbody tr').eq(0).within(() => { //it returns entire 1st row
		// 	cy.get('td').each(($column)=>{
		// 		if($column.text() == 'QTP')
		// 			cy.log('QTP text found')

		// 	cy.log($column.text())
		// 	})
		// })

		//fetch all cell data
		// cy.get('#table01 tbody tr').each((eachRow) => {
		// 	cy.wrap(eachRow).within(() => {
		// 		cy.get('td').each(($eachColumn) => {
		// 			cy.log($eachColumn.text())
		// 		})

		// 	})
		// })

		//perform certain action based on matching cell data
		/*cy.get('#table01 tbody tr').each(($row) => {
			cy.wrap($row).within(() => {
				cy.get('td').each(($column) => {
					if($column.text() == 'GUI')
					{
						//cy.get('td').eq(0).click();
						cy.get('[type=\'checkbox\']').click(); //it does not depends on any column index
						cy.get('td').eq(4).click(); //identify the delete button and click

					}
				})
			})
		})*/

		cy.get('#table01').contains('tr', 'Functional').within(() => {

			cy.get('[type=\'checkbox\']').click(); //it does not depends on any column index
			cy.get('td').eq(4).click(); //identify the delete button and click

		})

	})
})