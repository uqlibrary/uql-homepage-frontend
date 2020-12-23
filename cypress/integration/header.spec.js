context('Header', () => {
    it('site search button toggles', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('li.menu-global__search-toggle button').contains('Toggle search');
        cy.get('#edit-as_sitesearch-off').should('have.attr', 'tabindex', '-1');
        cy.get('#edit-as_sitesearch-on').should('have.attr', 'tabindex', '-1');
        cy.get('#edit-q').should('have.attr', 'tabindex', '-1');
        cy.get('#uq-search').should('have.attr', 'tabindex', '-1');

        cy.get('li.menu-global__search-toggle button')
            .contains('Toggle search')
            .click();

        cy.get('#edit-as_sitesearch-off').should('have.attr', 'tabindex', '0');
        cy.get('#edit-as_sitesearch-on').should('have.attr', 'tabindex', '0');
        cy.get('#edit-q').should('have.attr', 'tabindex', '0');
        cy.get('#uq-search').should('have.attr', 'tabindex', '0');

        cy.get('li.menu-global__search-toggle button')
            .contains('Toggle search')
            .click();

        cy.get('#edit-as_sitesearch-off').should('have.attr', 'tabindex', '-1');
        cy.get('#edit-as_sitesearch-on').should('have.attr', 'tabindex', '-1');
        cy.get('#edit-q').should('have.attr', 'tabindex', '-1');
        cy.get('#uq-search').should('have.attr', 'tabindex', '-1');
    });

    it('mega menu toggles', () => {
        cy.visit('/');
        cy.viewport(414, 736);
        cy.get('div[data-testid="mobile-menu"]')
            .contains('Menu')
            .click();
        cy.get('div[data-testid="mega-menu"] nav')
            .children()
            .its('length')
            .should('be.gt', 0);

        cy.get('div[data-testid="mobile-menu"]')
            .contains('Menu')
            .click();
        cy.get('div[data-testid="mega-menu-empty"]').should('have.length', 1);
    });
});