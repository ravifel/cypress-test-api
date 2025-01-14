/// <reference types="cypress"/>

describe('Deletar dispositivo', () => {

    it('Deletar um dispositivo', () => {

        const body = {
            "name": "Ravi Laptop",
            "data": {
                "year": 2024,
                "price": 1849.99,
                "CPU model": "Intel Core i5",
                "Hard disk size": "1 TB",
                "Owner": "Ravi Silva LTDA"
            }
        }

        cy.request({
            method: 'POST',
            url: `https://api.restful-api.dev/objects`,
            failOnStatusCode: false,
            body: body
        }).as('postDeviceResult')

        // Pegando o result do cadastro, para pegar o 'id'
        cy.get('@postDeviceResult')
            .then((response_post) => {
                expect(response_post.status).equal(200);

                cy.request({
                    method: 'DELETE',
                    url: `https://api.restful-api.dev/objects/${response_post.body.id}`,
                    failOnStatusCode: false
                }).as('deleteDeviceResult')

                //validations do delete
                cy.get('@deleteDeviceResult').then((response_delete) => {
                    expect(response_delete.status).equal(200)
                    expect(response_delete.body.message).equal(`Object with id = ${response_post.body.id} has been deleted.`);
                })
            })


    })

    it('Delete a non-existent device', () => {

        const nonExistentId = 'testId';
        cy.request({
            method: 'DELETE',
            url: `https://api.restful-api.dev/objects/${nonExistentId}`,
            failOnStatusCode: false
        }).as('deleteDeviceResult')

        //validations do delete
        cy.get('@deleteDeviceResult').then((response_delete) => {
            expect(response_delete.status).equal(404)
            expect(response_delete.body.error).equal(`Object with id = ${nonExistentId} doesn't exist.`);
        })
    })

    it('Delete an existing but reserved device', () => {

        cy.request({
            method: 'DELETE',
            url: `https://api.restful-api.dev/objects/7`,
            failOnStatusCode: false
        }).as('deleteDeviceResult')

        //validations do delete
        cy.get('@deleteDeviceResult').then((response_delete) => {
            expect(response_delete.status).equal(405)
            expect(response_delete.body.error).equal(`7 is a reserved id and the data object of it cannot be deleted. You can create your own new object via POST request and try to send a DELETE request with new generated object id.`);
        })
    })
})