context('ACCESSIBILITY', () => {
    it('Footer', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('[data-testid=connect-footer] h3').contains('Connect with us');
        cy.log('Connect Footer');
        cy.checkA11y('[data-testid=connect-footer]', {
            reportName: 'Connect Footer',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });

        cy.get('[data-testid=minimal-footer]').should('contain', '3365 1111');
        cy.log('Minimal Footer');
        cy.checkA11y('[data-testid=minimal-footer]', {
            reportName: 'Minimal Footer',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});
