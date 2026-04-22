# K6 Load Tests

Testes de carga com **K6** para a API JSONPlaceholder.

## Testes disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| Smoke | `npm run smoke` | 1 VU / 30s — valida API antes da carga |
| Load | `npm run load` | 500 VUs / 5 min — teste principal |
| Stress | `npm run stress` | Até 1000 VUs — encontra ponto de quebra |

## Instalação do K6

**Windows:**
```powershell
winget install k6 --source winget
```

**Mac:**
```bash
brew install k6
```

**Linux:**
```bash
sudo apt-get install k6
```

## Executando

```bash
# Smoke test rápido
npm run smoke

# Teste de carga completo com relatório
npm run load:report

# Gerar relatório HTML
npm run report

# Tudo em sequência
npm run run:all
```

## Thresholds configurados

| Métrica | Critério |
|---------|---------|
| `http_req_duration` | p(95) < 2000ms |
| `error_rate` | < 1% |
| `success_rate` | > 99% |
| `get_duration` | avg < 800ms |

## Resultado esperado com 500 VUs

```
✓ http_req_duration............: avg=342ms p(95)=834ms
✓ error_rate...................: 0.60%
✓ success_rate.................: 99.40%
✓ http_reqs....................: 148320 (274/s)
```
