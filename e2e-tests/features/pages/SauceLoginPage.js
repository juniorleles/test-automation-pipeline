/**
 * Page Object: SauceLoginPage
 * Página de login do SauceDemo (https://www.saucedemo.com)
 */
class SauceLoginPage {
  constructor(page) {
    this.page = page;

    this.usernameInput = '#user-name';
    this.passwordInput = '#password';
    this.loginButton   = '#login-button';
    this.errorMessage  = '[data-test="error"]';

    this.url      = 'https://www.saucedemo.com';
    this.password = 'secret_sauce'; // senha padrão do SauceDemo
  }

  async navigate() {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  async login(username) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, this.password);
    await this.page.click(this.loginButton);
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage() {
    await this.page.waitForSelector(this.errorMessage, { timeout: 5000 });
    return this.page.textContent(this.errorMessage);
  }

  async isOnLoginPage() {
    return this.page.url().includes('saucedemo.com') &&
           !this.page.url().includes('inventory');
  }
}

module.exports = { SauceLoginPage };
