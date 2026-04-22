/**
 * Page Object: LoginPage
 * Encapsula todos os seletores e ações da página de login.
 * Padrão Page Object Pattern — mantém os testes desacoplados da UI.
 */
class LoginPage {
  constructor(page) {
    this.page = page;

    // ── Seletores ──────────────────────────────────────
    this.usernameInput = '#username';
    this.passwordInput = '#password';
    this.loginButton   = 'button[type="submit"]';
    this.flashMessage  = '#flash';
    this.flashError    = '#flash.error';
    this.flashSuccess  = '#flash.success';
    this.logoutButton  = 'a[href="/logout"]';
    this.pageHeading   = 'h2';

    // ── URLs absolutas (evita depender de baseURL no contexto) ──
    this.loginUrl  = 'https://the-internet.herokuapp.com/login';
    this.secureUrl = 'https://the-internet.herokuapp.com/secure';
  }

  // ── Navegação ──────────────────────────────────────

  async navigate() {
    await this.page.goto(this.loginUrl);
    await this.page.waitForLoadState('networkidle');
  }

  async getCurrentUrl() {
    return this.page.url();
  }

  // ── Ações ──────────────────────────────────────────

  async fillUsername(username) {
    await this.page.fill(this.usernameInput, username);
  }

  async fillPassword(password) {
    await this.page.fill(this.passwordInput, password);
  }

  async clickLogin() {
    await this.page.click(this.loginButton);
    await this.page.waitForLoadState('networkidle');
  }

  async clickLogout() {
    await this.page.click(this.logoutButton);
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async clearUsername() {
    await this.page.fill(this.usernameInput, '');
  }

  async clearPassword() {
    await this.page.fill(this.passwordInput, '');
  }

  // ── Getters / Assertivas ───────────────────────────

  async getFlashMessage() {
    await this.page.waitForSelector(this.flashMessage, { timeout: 5000 });
    const text = await this.page.textContent(this.flashMessage);
    return text.replace('×', '').trim();
  }

  async isErrorMessageVisible() {
    return this.page.isVisible(this.flashError);
  }

  async isSuccessMessageVisible() {
    return this.page.isVisible(this.flashSuccess);
  }

  async isLogoutButtonVisible() {
    return this.page.isVisible(this.logoutButton);
  }

  async getPageTitle() {
    return this.page.title();
  }

  async getHeadingText() {
    return this.page.textContent(this.pageHeading);
  }

  async isOnLoginPage() {
    const url = await this.getCurrentUrl();
    return url.includes('/login');
  }

  async isOnSecurePage() {
    const url = await this.getCurrentUrl();
    return url.includes('/secure');
  }
}

module.exports = { LoginPage };
