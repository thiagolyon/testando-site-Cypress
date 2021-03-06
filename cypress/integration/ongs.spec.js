/// <reference types="cypress" />

describe('Ongs', () => {
    it('devem poder realizar o cadastro', () => {
        cy.visit('http://localhost:3000/register')
        // cy.get - busca um elemento
        // .type - insere um texto
        cy.get('[data-cy=name]').type('Dogs queridos');
        cy.get('[data-cy=email]').type('theodoro@au.com.br');
        cy.get('[data-cy=whatsapp]').type('011223344');
        cy.get('[data-cy=city]').type('Bolinha Land');
        cy.get('[data-cy=uf]').type('AU');

        // routing
        // start server com cy.server()
        // criar uma rota com cy.route()
        // atribuir rota a alias
        // espera com cy.wait e fazer uma validação

        cy.route('POST', '**/ongs').as('postOng');

        cy.get('[data-cy=submit]').click()

        cy.wait('@postOng').then((xhr) => {
            expect(xhr.status).be.eq(200);
            expect(xhr.response.body).has.property('id');
            expect(xhr.response.body.id).is.not.null;
        })
    });

    it('devem poder realizar o login no sistema', () => {
        cy.visit('http://localhost:3000/');
        cy.get('[data-cy=id]').type(Cypress.env('createdOngId'));
        cy.get('[data-cy=button-login]').click();
    });

    it('devem poder fazer logout', () => {
        cy.login();
        cy.get('[data-cy=button-logout]').click();
    });

    it('devem poder cadastrar novos casos', () => {
        cy.login();

        cy.get('[data-cy="button-new"]').click();
        cy.get('[data-cy=case-title]').type('Pet para adoção');
        cy.get('[data-cy="description"]').type('Pet vacinado e castrado');
        cy.get('[data-cy="value"]').type('0');

        cy.route('POST', '**/incidents').as('newIncident');

        cy.get('[data-cy="register"]').click();

        cy.wait('@newIncident').then((xhr) => {
            expect(xhr.status).to.eq(200);
            expect(xhr.response.body).has.property('id');
            expect(xhr.response.body.id).is.not.null;
        })
    } )

    it('Devem poder excluir um caso', () => {
        cy.createNewIncident();
        cy.login();

        cy.route('DELETE', '**/incidents/*').as('deleteIncident');

        cy.get('[data-cy="button-delete"]').click();

        cy.wait('@deleteIncident').then((xhr) => {
            expect(xhr.status).to.eq(204);
            expect(xhr.response.body).to.be.empty;
        })
    })
});