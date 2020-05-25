describe('ng-integration', () => {
    beforeEach(() => cy.visit('/'));

    it('should display posts', () => {
        cy.get('a').contains('Posts').click();
        cy.contains('#100').should('exist');
        cy.contains('#1010').should('not.exist');

        cy.contains('#100').click();
        cy.get('app-posts-show').contains('#100').should('exist');
    });

    it('should display paginated posts', () => {
        cy.get('a').contains('Paginated').click();
        cy.contains('#100').should('not.exist');
        cy.contains('#5').should('exist');
        cy.contains('#10').should('not.exist');

        cy.contains('#5').click();
        cy.get('app-posts-show').contains('#5').should('exist');

        cy.contains('Load more').should('exist');
        cy.contains('Load more').click();
        cy.contains('#5').should('exist');
        cy.contains('#10').should('exist');
    });

    it('should populate & display comments', () => {
        cy.get('a').contains('With comments').click();
        cy.contains('#10').should('not.exist');
        cy.contains('#5').should('exist');
        cy.contains('#5').click();

        cy.get('app-posts-show').get('frrri-many').contains('Noemie@marques.me').should('exist');
    });

    it('should populate & display users & comments', () => {
        cy.get('a').contains('With user & comments').click();
        cy.contains('#10').should('not.exist');
        cy.contains('#4').should('exist');
        cy.get('frrri-many').contains('Leanne Graham').should('exist');
        cy.contains('#4').click();
        cy.wait(2000);

        cy.get('app-posts-show').contains('Sincere@april.biz').should('exist');
        cy.get('app-posts-show').get('frrri-many').contains('Christine@ayana.info').should('exist');
    });

    it('should clear populations after switching routes', () => {
        cy.get('a').contains('With comments').click();
        cy.contains('#10').should('not.exist');
        cy.contains('#5').should('exist');
        cy.contains('#5').click();
        cy.wait(2000);
        cy.get('app-posts-show').get('frrri-many').contains('Noemie@marques.me').should('exist');

        cy.get('a').contains('Posts').click();
        cy.contains('#4').click();
        cy.wait(2000);
        cy.get('app-posts-show').contains('#4').should('exist');
        cy.get('app-posts-show').get('frrri-many').contains('Christine@ayana.info').should('not.exist');
    });
});
