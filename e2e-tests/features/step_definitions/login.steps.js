/**
 * Step Definitions — Login
 * Implementa cada passo definido no arquivo login.feature.
 * Usa os Page Objects via this (CustomWorld).
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// ── GIVEN ──────────────────────────────────────────────────────────────────

Given('que estou na página de login', async function () {
  await this.loginPage.navigate();

  const title = await this.loginPage.getPageTitle();
  expect(title).toContain('The Internet');
});

// ── WHEN ───────────────────────────────────────────────────────────────────

When('preencho o usuário com {string}', async function (username) {
  await this.loginPage.fillUsername(username);
});

When('preencho a senha com {string}', async function (password) {
  await this.loginPage.fillPassword(password);
});

When('deixo o campo usuário em branco', async function () {
  await this.loginPage.clearUsername();
});

When('deixo o campo senha em branco', async function () {
  await this.loginPage.clearPassword();
});

When('clico no botão de login', async function () {
  await this.loginPage.clickLogin();
});

When('clico no botão de logout', async function () {
  await this.securePage.clickLogout();
});

// ── THEN — Fluxos Positivos ────────────────────────────────────────────────

Then('devo ser redirecionado para a área segura', async function () {
  const isOnSecure = await this.loginPage.isOnSecurePage();
  expect(isOnSecure).toBe(true);
});

Then('devo ver a mensagem de boas-vindas {string}', async function (expectedMessage) {
  const flashMessage = await this.securePage.getFlashMessage();
  expect(flashMessage).toContain(expectedMessage);
});

Then('devo ver o botão de logout', async function () {
  const isVisible = await this.securePage.isLogoutButtonVisible();
  expect(isVisible).toBe(true);
});

Then('devo estar na URL {string}', async function (urlPath) {
  const currentUrl = await this.loginPage.getCurrentUrl();
  expect(currentUrl).toContain(urlPath);
});

Then('o heading da página deve conter {string}', async function (expectedTitle) {
  // O <title> do site é sempre "The Internet" em todas as páginas.
  // A distinção é feita pelo heading <h2> que contém "Secure Area".
  const heading = await this.securePage.getHeadingText();
  expect(heading).toContain(expectedTitle);
});

Then('devo ser redirecionado para a página de login', async function () {
  const isOnLogin = await this.loginPage.isOnLoginPage();
  expect(isOnLogin).toBe(true);
});

Then('devo ver a mensagem {string}', async function (expectedMessage) {
  const flashMessage = await this.loginPage.getFlashMessage();
  expect(flashMessage).toContain(expectedMessage);
});

// ── THEN — Fluxos Negativos ────────────────────────────────────────────────

Then('devo ver a mensagem de erro {string}', async function (expectedError) {
  const isErrorVisible = await this.loginPage.isErrorMessageVisible();
  expect(isErrorVisible).toBe(true);

  const flashMessage = await this.loginPage.getFlashMessage();
  expect(flashMessage).toContain(expectedError);
});

Then('devo permanecer na página de login', async function () {
  const isOnLogin = await this.loginPage.isOnLoginPage();
  expect(isOnLogin).toBe(true);
});
