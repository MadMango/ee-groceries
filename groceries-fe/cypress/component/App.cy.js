/* eslint-disable cypress/no-unnecessary-waiting */
import App from '../../src/App';
import groceries from '../../src/fixtures/groceries.json';
import { resetGroceries } from '../../src/httpService';

// I couldn't get waiting for animations to finish to work in the time I had, so unfortunately, I'm using timeouts in miliseconds
const animationTime = 300;

const keyboardNavigation = (key) => {
  if (key === 'tab') {
    cy.get('body').tab();
  } else {
    cy.get('body').type(
      `{${key}}`,
    );
  }
  cy.wait(animationTime);
};

const selectors = {
  rows: 'div[role="row"]',
  textInput: '[data-testid="text-input"]',
  addButton: '[data-testid="add-button"]',
  resetButton: '[data-testid="reset-button"]',
};

describe('<App>', () => {

  beforeEach(async () => {
    await resetGroceries();
  });

  it('mounts', () => {
    cy.mount(<App />);
  });

  it('contains list items', () => {
    cy.mount(<App />);

    cy.wait(animationTime);
    cy.get(selectors.rows).should('exist').should('have.length', 6);
    groceries.forEach(({ name }, index) => {
      cy.get(selectors.rows).eq(index).should('contain.text', name);
    });
  });

  it('can reorder items', () => {
    cy.mount(<App />);
    cy.wait(animationTime);
    keyboardNavigation('tab');
    keyboardNavigation('rightArrow');
    keyboardNavigation('enter');
    keyboardNavigation('downArrow');
    keyboardNavigation('enter');

    cy.wait(animationTime);
    const reorderedGroceries = [groceries[1], groceries[0], ...groceries.slice(2)];
    reorderedGroceries.forEach(({ name }, index) => {
      cy.get(selectors.rows).eq(index).should('contain.text', name);
    });
  });

  it('can tick and untick items', () => {
    cy.mount(<App />);
    cy.wait(animationTime);
    keyboardNavigation('tab');
    keyboardNavigation('enter');

    cy.wait(animationTime);
    const reorderedGroceries = [...groceries.slice(1), groceries[0]];
    reorderedGroceries.forEach(({ name }, index) => {
      cy.get(selectors.rows).eq(index).should('contain.text', name);
    });
    keyboardNavigation('enter');

    cy.wait(animationTime);
    [...groceries.slice(1), groceries[0]].forEach(({ name }, index) => {
      cy.get(selectors.rows).eq(index).should('contain.text', name);
    });
  });

  it('can remove items', () => {
    cy.mount(<App />);
    cy.wait(animationTime);
    keyboardNavigation('tab');
    keyboardNavigation('rightArrow');
    keyboardNavigation('rightArrow');
    keyboardNavigation('rightArrow');
    keyboardNavigation('enter');

    cy.wait(animationTime);
    cy.get(selectors.rows).should('exist').should('have.length', 5);
    const groceriesAfterDeletion = [...groceries.slice(1)];
    groceriesAfterDeletion.forEach(({ name }, index) => {
      cy.get(selectors.rows).eq(index).should('contain.text', name);
    });
  });

  it('can add items', () => {
    cy.mount(<App />);
    cy.wait(animationTime);

    // add using keyboard
    cy.get(selectors.textInput).type('Potato 🥔');
    keyboardNavigation('enter');

    // add by clicking a button
    cy.get(selectors.textInput).type('Cabbage 🥬');
    cy.get(selectors.addButton).click();

    cy.wait(animationTime);
    cy.get(selectors.rows).should('exist').should('have.length', 8);
    const groceriesUpdated = [...groceries, { name: 'Potato 🥔' }, { name: 'Cabbage 🥬' }];
    groceriesUpdated.forEach(({ name }, index) => {
      cy.get(selectors.rows).eq(index).should('contain.text', name);
    });
  });

  it('can reset data', () => {
    cy.mount(<App />);
    cy.wait(animationTime);

    // add using keyboard
    cy.get(selectors.textInput).type('Potato 🥔');
    keyboardNavigation('enter');

    // add by clicking a button
    cy.get(selectors.textInput).type('Cabbage 🥬');
    cy.get(selectors.addButton).click();

    cy.wait(animationTime);
    cy.get(selectors.rows).should('exist').should('have.length', 8);
    cy.get(selectors.resetButton).click();
    cy.wait(animationTime);
    cy.get(selectors.rows).should('exist').should('have.length', 6);
  });
});