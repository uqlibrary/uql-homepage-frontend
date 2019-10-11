import { default as recordList } from '../../../src/mock/data/records/publicationTypeListConferenceProceedings';

context('Conference Proceedings admin edit', () => {
    const record = recordList.data[0];
    const {
        dsi_dsid: visibleFilename,
        dsi_label: visibleFileDescription,
        dsi_security_policy: visibleFileSecurityPolicy,
    } = record.fez_datastream_info[0];
    const { dsi_dsid: hiddenFilename } = record.fez_datastream_info[1];

    beforeEach(() => {
        cy.visit(`/admin/edit/${record.rek_pid}?user=uqstaff`);
        cy.closeUnsupported();
        cy.wait(1000); // Wait for data load
    });

    afterEach(() => {
        cy.window()
            .then(win => (win.onbeforeunload = undefined));
    });

    it('should load expected tabs', () => {
        // cy.get('.StandardPage h3')
        cy.get('.StandardPage form > div > div > div.StandardCard > div > div > h3')
            .as('cards')
            .should('have.length', 8);

        cy.wait(1000); // Allow more time for rendering tabbing mechanism
        cy.get('input[value=tabbed]')
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');

        cy.get('[role="tab"]')
            .eq(3)
            .find('[class*="MuiBadge-colorError"]')
            .should('have.text', '1');
    });

    it('should render Bibliographic tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(3)')
            .within(() => {
                cy.get('div:nth-child(1) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Title of proceedings');
                    });
            });
    });

    it('should render Files tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(7)')
            .within(() => {
                cy.get('div:nth-child(1) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Attached files');

                        cy.get('[class*=MuiCardContent-root] > div')
                            .within(() => {
                                cy.get(`a[title="${visibleFilename}"]`)
                                    .should('have.length', 1);
                                cy.get(`a[title="${hiddenFilename}"]`)
                                    .should('have.length', 0);

                                cy.get('input[name=fileDescription]')
                                    .should('have.value', visibleFileDescription);
                            });
                    });
            });
    });

    it('should render Security tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(8)')
            .within(() => {
                cy.get('h3')
                    .eq(2)
                    .should('have.text', `Datastream level security - ${record.rek_pid}`);

                cy.get('div:nth-child(2) > .StandardCard')
                    .within(() => {
                        cy.get('h6')
                            .eq(0)
                            .should('have.text', 'Inherited datastream security policy details');
                        record.fez_record_search_key_ismemberof.forEach((collection, index) => {
                            cy.get('h6')
                                .eq(2 * index + 1)
                                .should('have.text', collection.rek_ismemberof);
                            cy.get('h6')
                                .eq(2 * index + 2)
                                .should('have.text', collection.rek_ismemberof_lookup);
                            cy.get('p')
                                .eq(index)
                                .should('have.text', `Public (${collection.parent.rek_security_policy})`);
                        });
                        cy.get('h6')
                            .contains('Override datastream security policy details')
                            .siblings('div')
                            .as('dsiPolicyBlock')
                            .find(`a[title="${visibleFilename}"]`)
                            .should('have.text', visibleFilename);
                        cy.get('@dsiPolicyBlock')
                            .find(`input[name="${visibleFilename}"]`)
                            .should('have.value', visibleFileSecurityPolicy.toString());
                    });
            });
    });
});