/**
 * Gera relatório HTML unificado de todos os testes E2E.
 */
const report = require('multiple-cucumber-html-reporter');
const path   = require('path');
const fs     = require('fs');

// Coletar todos os JSONs de relatório disponíveis
const reportsDir = path.join('reports');
const jsonFiles  = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('.json'))
  .map(f => path.join(reportsDir, f));

if (jsonFiles.length === 0) {
  console.log('Nenhum relatório JSON encontrado. Rode os testes primeiro.');
  process.exit(0);
}

report.generate({
  jsonDir:    reportsDir,
  reportPath: path.join(reportsDir, 'html-report'),
  metadata: {
    browser:  { name: 'chromium', version: 'latest' },
    device:   'CI / Local Machine',
    platform: { name: process.platform, version: process.version },
  },
  customData: {
    title: 'Relatório de Testes E2E',
    data: [
      { label: 'Projeto',    value: 'E2E Tests — Cucumber + Playwright' },
      { label: 'Tarefa 1',   value: 'Login — The Internet Herokuapp' },
      { label: 'Tarefa 2',   value: 'Checkout — SauceDemo' },
      { label: 'Execução',   value: new Date().toLocaleString('pt-BR') },
    ],
  },
  pageTitle:   'Relatório E2E Completo',
  reportName:  'E2E — Login + Checkout',
  displayDuration: true,
  durationInMS:    true,
});

console.log('✅ Relatório HTML gerado em: reports/html-report/index.html');
