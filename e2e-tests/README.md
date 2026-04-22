# E2E Tests — Cucumber + Playwright

Testes End-to-End com **Cucumber (BDD)** + **Playwright** usando **Page Object Pattern**.

---

## Aplicações testadas

| Tarefa | Aplicação | URL |
|--------|-----------|-----|
| 1 | The Internet Herokuapp | https://the-internet.herokuapp.com/login |
| 2 | SauceDemo E-commerce | https://www.saucedemo.com |

---

## Estrutura

```
e2e-tests-cucumber-playwright/
├── features/
│   ├── login.feature              # Tarefa 1 — Login (11 cenários)
│   ├── checkout.feature           # Tarefa 2 — Checkout (13 cenários)
│   ├── pages/
│   │   ├── LoginPage.js           # PO: login (The Internet)
│   │   ├── SecurePage.js          # PO: área segura (The Internet)
│   │   ├── SauceLoginPage.js      # PO: login (SauceDemo)
│   │   ├── InventoryPage.js       # PO: catálogo de produtos
│   │   ├── CartPage.js            # PO: carrinho de compras
│   │   ├── CheckoutStepOnePage.js # PO: formulário de entrega
│   │   ├── CheckoutCompletePage.js# PO: revisão do pedido
│   │   └── OrderConfirmationPage.js # PO: confirmação de compra
│   ├── step_definitions/
│   │   ├── login.steps.js         # Steps da Tarefa 1
│   │   └── checkout.steps.js      # Steps da Tarefa 2
│   └── support/
│       ├── world.js               # CustomWorld — contexto compartilhado
│       └── hooks.js               # Before/After + screenshot em falha
├── scripts/generate-report.js    # Relatório HTML unificado
├── reports/                       # Gerado automaticamente
├── .github/workflows/             # CI/CD GitHub Actions
├── cucumber.js                    # Configuração + profiles
└── package.json
```

---

## Instalação

```bash
npm install
npx playwright install chromium
```

---

## Executando os testes

```bash
# Todos os testes
npm test

# Apenas Tarefa 1 — Login
npm run test:login

# Apenas Tarefa 2 — Checkout
npm run test:checkout

# Por tag
npm run test:positivo
npm run test:negativo
npm run test:smoke

# Com browser visível (debug)
npm run test:headed

# Gerar relatório HTML
npm run report:html
```

---

## Cobertura — Tarefa 2: Checkout

### Positivos (4 cenários)
| Cenário | Validação |
|---------|-----------|
| Compra completa com 1 produto | Confirmação "Thank you for your order!" |
| Compra com 3 produtos | Total > 0 + confirmação |
| Remover produto antes do checkout | Contagem correta no carrinho |
| Badge do carrinho | Atualiza conforme produtos adicionados |

### Negativos (9 cenários)
| Cenário | Erro Esperado |
|---------|---------------|
| Formulário totalmente em branco | "First Name is required" |
| Sem sobrenome | "Last Name is required" |
| Sem CEP | "Postal Code is required" |
| Cancelar no formulário | Retorna ao carrinho |
| Cancelar na revisão | Retorna ao catálogo |
| Checkout com carrinho vazio | Resumo sem produtos |
| Esquema: 3 combinações inválidas | Cada erro específico |

**Total Tarefa 2: 13 cenários** (4 positivos + 9 negativos)  
**Total geral: 24 cenários** (7 positivos + 17 negativos)

---

## Boas práticas aplicadas

- **Page Object Pattern** — 8 Page Objects, um por página/componente
- **CustomWorld** — estado compartilhado sem variáveis globais
- **Cucumber Profiles** — `login` e `checkout` executam isoladamente
- **Tags** — `@positivo`, `@negativo`, `@smoke`, `@checkout`, `@login`
- **Esquema do Cenário** — data-driven testing com tabelas de exemplos
- **Screenshot automático** em qualquer falha (anexado ao relatório)
- **Hooks** — setup/teardown automático por cenário
- **CI/CD** — GitHub Actions com artifact de relatório
