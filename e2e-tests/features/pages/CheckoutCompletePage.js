/**
 * Page Object: CheckoutStepTwoPage
 * Revisão do pedido — Passo 2 do checkout (resumo + total).
 */
class CheckoutStepTwoPage {
  constructor(page) {
    this.page = page;

    this.cartItems       = '.cart_item';
    this.cartItemName    = '.inventory_item_name';
    this.itemTotal       = '.summary_subtotal_label';
    this.taxLabel        = '.summary_tax_label';
    this.totalLabel      = '.summary_total_label';
    this.finishButton    = '[data-test="finish"]';
    this.cancelButton    = '[data-test="cancel"]';
    this.summaryInfo     = '.summary_info';
    this.paymentInfo     = '.summary_value_label';
  }

  async waitForLoad() {
    await this.page.waitForURL('**/checkout-step-two.html', { timeout: 10000 });
    await this.page.waitForSelector(this.summaryInfo);
  }

  async getOrderItemCount() {
    return this.page.locator(this.cartItems).count();
  }

  async getOrderItemNames() {
    return this.page.locator(this.cartItemName).allTextContents();
  }

  async getItemTotal() {
    const text = await this.page.textContent(this.itemTotal);
    // Extrai o número: "Item total: $29.99" → 29.99
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTaxAmount() {
    const text = await this.page.textContent(this.taxLabel);
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTotalAmount() {
    const text = await this.page.textContent(this.totalLabel);
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async containsProduct(productName) {
    const names = await this.getOrderItemNames();
    return names.some(n => n.includes(productName));
  }

  async clickFinish() {
    await this.page.click(this.finishButton);
    await this.page.waitForLoadState('networkidle');
  }

  async clickCancel() {
    await this.page.click(this.cancelButton);
    await this.page.waitForLoadState('networkidle');
  }

  async isOnStepTwoPage() {
    return this.page.url().includes('checkout-step-two');
  }

  async getTotalText() {
    return this.page.textContent(this.totalLabel);
  }
}

module.exports = { CheckoutStepTwoPage };
