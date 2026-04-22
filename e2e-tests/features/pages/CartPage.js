/**
 * Page Object: CartPage
 * Página do carrinho de compras do SauceDemo.
 */
class CartPage {
  constructor(page) {
    this.page = page;

    this.cartItems         = '.cart_item';
    this.cartItemName      = '.inventory_item_name';
    this.checkoutButton    = '[data-test="checkout"]';
    this.continueShoppingBtn = '[data-test="continue-shopping"]';
    this.removeButtonFor   = (productName) =>
      `//div[text()="${productName}"]/ancestor::div[@class="cart_item"]//button[contains(text(),"Remove")]`;
    this.cartQuantity      = '.cart_quantity';
  }

  async waitForLoad() {
    await this.page.waitForURL('**/cart.html', { timeout: 10000 });
  }

  async getCartItemCount() {
    const items = this.page.locator(this.cartItems);
    return items.count();
  }

  async getCartItemNames() {
    return this.page.locator(this.cartItemName).allTextContents();
  }

  async isCartEmpty() {
    const count = await this.getCartItemCount();
    return count === 0;
  }

  async removeProduct(productName) {
    const btn = this.page.locator(this.removeButtonFor(productName));
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
  }

  async proceedToCheckout() {
    await this.page.click(this.checkoutButton);
    await this.page.waitForLoadState('networkidle');
  }

  async continueShopping() {
    await this.page.click(this.continueShoppingBtn);
    await this.page.waitForLoadState('networkidle');
  }

  async isOnCartPage() {
    return this.page.url().includes('/cart');
  }

  async containsProduct(productName) {
    const names = await this.getCartItemNames();
    return names.some(n => n.includes(productName));
  }
}

module.exports = { CartPage };
