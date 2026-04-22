/**
 * Page Object: OrderConfirmationPage
 * Tela de confirmação após finalizar a compra.
 */
class OrderConfirmationPage {
  constructor(page) {
    this.page = page;

    this.confirmationHeader  = '.complete-header';
    this.confirmationText    = '.complete-text';
    this.ponyExpressImage    = '.pony_express';
    this.backHomeButton      = '[data-test="back-to-products"]';
  }

  async waitForLoad() {
    await this.page.waitForURL('**/checkout-complete.html', { timeout: 10000 });
    await this.page.waitForSelector(this.confirmationHeader);
  }

  async getConfirmationHeader() {
    return this.page.textContent(this.confirmationHeader);
  }

  async getConfirmationText() {
    return this.page.textContent(this.confirmationText);
  }

  async isConfirmationVisible() {
    return this.page.isVisible(this.confirmationHeader);
  }

  async clickBackToProducts() {
    await this.page.click(this.backHomeButton);
    await this.page.waitForLoadState('networkidle');
  }

  async isOnConfirmationPage() {
    return this.page.url().includes('checkout-complete');
  }
}

module.exports = { OrderConfirmationPage };
