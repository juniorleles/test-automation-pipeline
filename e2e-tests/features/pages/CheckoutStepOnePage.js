/**
 * Page Object: CheckoutStepOnePage
 * Formulário de dados de entrega — Passo 1 do checkout.
 */
class CheckoutStepOnePage {
  constructor(page) {
    this.page = page;

    this.firstNameInput  = '[data-test="firstName"]';
    this.lastNameInput   = '[data-test="lastName"]';
    this.postalCodeInput = '[data-test="postalCode"]';
    this.continueButton  = '[data-test="continue"]';
    this.cancelButton    = '[data-test="cancel"]';
    this.errorMessage    = '[data-test="error"]';
    this.errorButton     = '.error-button';
  }

  async waitForLoad() {
    await this.page.waitForURL('**/checkout-step-one.html', { timeout: 10000 });
    await this.page.waitForSelector(this.firstNameInput);
  }

  async fillFirstName(firstName) {
    await this.page.fill(this.firstNameInput, firstName);
  }

  async fillLastName(lastName) {
    await this.page.fill(this.lastNameInput, lastName);
  }

  async fillPostalCode(postalCode) {
    await this.page.fill(this.postalCodeInput, postalCode);
  }

  async fillForm({ firstName = '', lastName = '', postalCode = '' }) {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillPostalCode(postalCode);
  }

  async clickContinue() {
    await this.page.click(this.continueButton);
    await this.page.waitForLoadState('networkidle');
  }

  async clickCancel() {
    await this.page.click(this.cancelButton);
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage() {
    await this.page.waitForSelector(this.errorMessage, { timeout: 5000 });
    return this.page.textContent(this.errorMessage);
  }

  async isErrorVisible() {
    return this.page.isVisible(this.errorMessage);
  }

  async isOnStepOnePage() {
    return this.page.url().includes('checkout-step-one');
  }

  // Valida que o campo está destacado com erro (borda vermelha)
  async isFieldHighlightedAsError(field) {
    const selector = {
      firstName: this.firstNameInput,
      lastName: this.lastNameInput,
      postalCode: this.postalCodeInput,
    }[field];

    const classList = await this.page.getAttribute(selector, 'class');
    return classList && classList.includes('error');
  }
}

module.exports = { CheckoutStepOnePage };
