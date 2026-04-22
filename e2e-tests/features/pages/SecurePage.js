/**
 * Page Object: SecurePage
 * Encapsula elementos e ações da página segura (pós-login).
 */
class SecurePage {
  constructor(page) {
    this.page = page;

    // ── Seletores ──────────────────────────────────────
    this.heading       = 'h2';
    this.subHeading    = 'h4';
    this.flashMessage  = '#flash';
    this.logoutButton  = 'a[href="/logout"]';
    this.pageContent   = '#content';
  }

  // ── Getters ────────────────────────────────────────

  async getHeadingText() {
    await this.page.waitForSelector(this.heading);
    return this.page.textContent(this.heading);
  }

  async getFlashMessage() {
    await this.page.waitForSelector(this.flashMessage, { timeout: 5000 });
    const text = await this.page.textContent(this.flashMessage);
    return text.replace('×', '').trim();
  }

  async isLogoutButtonVisible() {
    return this.page.isVisible(this.logoutButton);
  }

  async getPageTitle() {
    return this.page.title();
  }

  async getCurrentUrl() {
    return this.page.url();
  }

  // ── Ações ──────────────────────────────────────────

  async clickLogout() {
    await this.page.click(this.logoutButton);
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { SecurePage };
