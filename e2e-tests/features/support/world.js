/**
 * World — Contexto compartilhado entre todos os steps do Cucumber.
 * Instancia o browser, page e todos os Page Objects.
 */

const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { chromium } = require('playwright');

// ── Tarefa 1: The Internet ──
const { LoginPage }   = require('../pages/LoginPage');
const { SecurePage }  = require('../pages/SecurePage');

// ── Tarefa 2: SauceDemo ──
const { SauceLoginPage }        = require('../pages/SauceLoginPage');
const { InventoryPage }         = require('../pages/InventoryPage');
const { CartPage }              = require('../pages/CartPage');
const { CheckoutStepOnePage }   = require('../pages/CheckoutStepOnePage');
const { CheckoutStepTwoPage }   = require('../pages/CheckoutCompletePage');
const { OrderConfirmationPage } = require('../pages/OrderConfirmationPage');

class CustomWorld extends World {
  constructor(options) {
    super(options);

    this.browser  = null;
    this.context  = null;
    this.page     = null;

    // Tarefa 1 — Page Objects
    this.loginPage  = null;
    this.securePage = null;

    // Tarefa 2 — Page Objects
    this.sauceLoginPage        = null;
    this.inventoryPage         = null;
    this.cartPage              = null;
    this.checkoutStepOnePage   = null;
    this.checkoutStepTwoPage   = null;
    this.orderConfirmationPage = null;

    this.baseUrl      = 'https://the-internet.herokuapp.com';
    this.sauceBaseUrl = 'https://www.saucedemo.com';
  }

  async init() {
    const headless = process.env.HEADLESS !== 'false';

    this.browser = await chromium.launch({ headless });

    // baseURL permite URLs relativas como '/login' e '/secure'
    this.context = await this.browser.newContext({
      baseURL: this.baseUrl,
      viewport: { width: 1280, height: 720 },
      locale: 'pt-BR',
    });

    this.page = await this.context.newPage();

    // Tarefa 1
    this.loginPage  = new LoginPage(this.page);
    this.securePage = new SecurePage(this.page);

    // Tarefa 2
    this.sauceLoginPage        = new SauceLoginPage(this.page);
    this.inventoryPage         = new InventoryPage(this.page);
    this.cartPage              = new CartPage(this.page);
    this.checkoutStepOnePage   = new CheckoutStepOnePage(this.page);
    this.checkoutStepTwoPage   = new CheckoutStepTwoPage(this.page);
    this.orderConfirmationPage = new OrderConfirmationPage(this.page);
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(CustomWorld);
