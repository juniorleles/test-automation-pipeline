/**
 * Hooks do Cucumber — executados antes e depois de cada cenário.
 * Responsável por inicializar e encerrar o browser.
 */

const { Before, After, AfterStep, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const path = require('path');
const fs   = require('fs');

// ── Timeout global ─────────────────────────────────
// O padrão do Cucumber é 5000ms — insuficiente para
// chromium.launch() + navegação em redes lentas.
setDefaultTimeout(60 * 1000); // 60 segundos

// ── Antes de cada cenário ──────────────────────────
Before({ timeout: 60 * 1000 }, async function (scenario) {
  await this.init();
  console.log(`\n▶ Iniciando: ${scenario.pickle.name}`);
});

// ── Após cada step — captura screenshot em falha ──
AfterStep({ timeout: 15 * 1000 }, async function ({ result, pickleStep }) {
  if (result.status === Status.FAILED) {
    try {
      const screenshotDir = path.join('reports', 'screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      const safeName = pickleStep.text
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 50);
      const filename  = `${Date.now()}_${safeName}.png`;
      const filepath  = path.join(screenshotDir, filename);

      const screenshot = await this.page.screenshot({
        path: filepath,
        fullPage: true,
      });

      await this.attach(screenshot, 'image/png');
      console.log(`  📸 Screenshot salvo: ${filepath}`);
    } catch (err) {
      console.warn(`  ⚠ Não foi possível capturar screenshot: ${err.message}`);
    }
  }
});

// ── Após cada cenário ──────────────────────────────
After({ timeout: 30 * 1000 }, async function (scenario) {
  const status = scenario.result.status;
  const icon   = status === Status.PASSED ? '✅' : '❌';

  console.log(`${icon} Finalizado: ${scenario.pickle.name} [${status}]`);

  await this.teardown();
});
