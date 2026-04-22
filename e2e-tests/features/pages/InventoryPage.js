/**
 * Page Object: InventoryPage
 * Catálogo de produtos do SauceDemo.
 */
class InventoryPage {
  constructor(page) {
    this.page = page;

    this.inventoryList      = '.inventory_list';
    this.inventoryItem      = '.inventory_item';
    this.cartBadge          = '.shopping_cart_badge';
    this.cartLink           = '.shopping_cart_link';
    this.productTitle       = '.inventory_item_name';
    this.productPrice       = '.inventory_item_price';
    this.addToCartButtonFor = (productName) =>
      `//div[text()="${productName}"]/ancestor::div[@class="inventory_item"]//button[contains(text(),"Add to cart")]`;
    this.removeButtonFor    = (productName) =>
      `//div[text()="${productName}"]/ancestor::div[@class="inventory_item"]//button[contains(text(),"Remove")]`;
  }

  async waitForLoad() {
    await this.page.waitForSelector(this.inventoryList, { timeout: 10000 });
  }

  async addProductToCart(productName) {
    const button = this.page.locator(this.addToCartButtonFor(productName));
    await button.waitFor({ state: 'visible', timeout: 5000 });
    await button.click();
  }

  async getCartBadgeCount() {
    const badge = this.page.locator(this.cartBadge);
    const isVisible = await badge.isVisible();
    if (!isVisible) return 0;
    const text = await badge.textContent();
    return parseInt(text, 10);
  }

  async goToCart() {
    await this.page.click(this.cartLink);
    await this.page.waitForLoadState('networkidle');
  }

  async isOnInventoryPage() {
    return this.page.url().includes('/inventory');
  }

  async getProductCount() {
    return this.page.locator(this.inventoryItem).count();
  }
}

module.exports = { InventoryPage };
