/**
 * Step Definitions — Checkout (Tarefa 2)
 * Implementa todos os steps do arquivo checkout.feature.
 * Usa os Page Objects via this (CustomWorld).
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect }            = require('@playwright/test');

// ── GIVEN ──────────────────────────────────────────────────────────────────

Given('que estou logado no SauceDemo como {string}', async function (username) {
  await this.sauceLoginPage.navigate();
  await this.sauceLoginPage.login(username);
  await this.inventoryPage.waitForLoad();

  const isOnInventory = await this.inventoryPage.isOnInventoryPage();
  expect(isOnInventory).toBe(true);
});

// ── WHEN — Carrinho ────────────────────────────────────────────────────────

When('adiciono o produto {string} ao carrinho', async function (productName) {
  await this.inventoryPage.addProductToCart(productName);
});

When('acesso o carrinho', async function () {
  await this.inventoryPage.goToCart();
  await this.cartPage.waitForLoad();
});

When('acesso o carrinho diretamente', async function () {
  await this.page.goto('https://www.saucedemo.com/cart.html');
  await this.cartPage.waitForLoad();
});

When('removo o produto {string} do carrinho', async function (productName) {
  await this.cartPage.removeProduct(productName);
});

When('prossigo para o checkout', async function () {
  await this.cartPage.proceedToCheckout();
  await this.checkoutStepOnePage.waitForLoad();
});

// ── WHEN — Formulário ──────────────────────────────────────────────────────

When('preencho os dados de entrega com nome {string} sobrenome {string} e CEP {string}',
  async function (firstName, lastName, postalCode) {
    await this.checkoutStepOnePage.fillForm({ firstName, lastName, postalCode });
    await this.checkoutStepOnePage.clickContinue();
    await this.checkoutStepTwoPage.waitForLoad();
  }
);

When('clico em continuar sem preencher os dados', async function () {
  await this.checkoutStepOnePage.clickContinue();
});

When('preencho apenas o primeiro nome com {string}', async function (firstName) {
  await this.checkoutStepOnePage.fillFirstName(firstName);
});

When('clico em continuar sem preencher os dados restantes', async function () {
  await this.checkoutStepOnePage.clickContinue();
});

When('preencho o nome {string} e sobrenome {string} sem CEP',
  async function (firstName, lastName) {
    await this.checkoutStepOnePage.fillFirstName(firstName);
    await this.checkoutStepOnePage.fillLastName(lastName);
  }
);

When('preencho o formulário com firstName {string} lastName {string} postalCode {string}',
  async function (firstName, lastName, postalCode) {
    await this.checkoutStepOnePage.fillForm({ firstName, lastName, postalCode });
  }
);

When('cancelo o checkout', async function () {
  await this.checkoutStepOnePage.clickCancel();
  await this.page.waitForLoadState('networkidle');
});

// ── WHEN — Revisão e Finalização ───────────────────────────────────────────

When('confirmo os dados do pedido', async function () {
  const isOnStepTwo = await this.checkoutStepTwoPage.isOnStepTwoPage();
  expect(isOnStepTwo).toBe(true);
});

When('finalizo a compra', async function () {
  await this.checkoutStepTwoPage.clickFinish();
  await this.orderConfirmationPage.waitForLoad();
});

When('cancelo o pedido na revisão', async function () {
  await this.checkoutStepTwoPage.clickCancel();
  await this.page.waitForLoadState('networkidle');
});

// ── THEN — Carrinho ────────────────────────────────────────────────────────

Then('o carrinho deve conter {int} produto(s)', async function (expectedCount) {
  const count = await this.cartPage.getCartItemCount();
  expect(count).toBe(expectedCount);
});

Then('o carrinho deve estar vazio', async function () {
  const isEmpty = await this.cartPage.isCartEmpty();
  expect(isEmpty).toBe(true);
});

Then('o badge do carrinho deve exibir {string}', async function (expectedBadge) {
  const count = await this.inventoryPage.getCartBadgeCount();
  expect(String(count)).toBe(expectedBadge);
});

// ── THEN — Revisão do Pedido ───────────────────────────────────────────────

Then('devo ver o resumo do pedido com o produto {string}', async function (productName) {
  const hasProduct = await this.checkoutStepTwoPage.containsProduct(productName);
  expect(hasProduct).toBe(true);
});

Then('o valor total do pedido deve ser maior que 0', async function () {
  const total = await this.checkoutStepTwoPage.getTotalAmount();
  expect(total).toBeGreaterThan(0);
});

Then('o resumo do pedido não deve conter produtos', async function () {
  const count = await this.checkoutStepTwoPage.getOrderItemCount();
  expect(count).toBe(0);
});

// ── THEN — Confirmação ─────────────────────────────────────────────────────

Then('devo ver a mensagem de confirmação {string}', async function (expectedMessage) {
  await this.orderConfirmationPage.waitForLoad();
  const header = await this.orderConfirmationPage.getConfirmationHeader();
  expect(header).toContain(expectedMessage);
});

// ── THEN — Erros de Formulário ─────────────────────────────────────────────

Then('devo ver o erro de campo obrigatório {string}', async function (expectedError) {
  const isVisible = await this.checkoutStepOnePage.isErrorVisible();
  expect(isVisible).toBe(true);

  const errorText = await this.checkoutStepOnePage.getErrorMessage();
  expect(errorText).toContain(expectedError);
});

// ── THEN — Navegação ───────────────────────────────────────────────────────

Then('devo retornar à página do carrinho', async function () {
  const isOnCart = await this.cartPage.isOnCartPage();
  expect(isOnCart).toBe(true);
});

Then('devo retornar à página de produtos', async function () {
  const isOnInventory = await this.inventoryPage.isOnInventoryPage();
  expect(isOnInventory).toBe(true);
});
