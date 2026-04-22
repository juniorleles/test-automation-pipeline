/**
 * K6 Load Test — Tarefa 1
 * API: JSONPlaceholder (https://jsonplaceholder.typicode.com)
 * Cenário: 500 usuários simultâneos por 5 minutos
 *
 * Execução:
 *   k6 run tests/load-test.js
 *   k6 run --out json=reports/results.json tests/load-test.js
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

// ─────────────────────────────────────────────────────────────
// MÉTRICAS CUSTOMIZADAS
// ─────────────────────────────────────────────────────────────
const errorRate       = new Rate('error_rate');        // % de requisições com erro
const successRate     = new Rate('success_rate');      // % de requisições com sucesso
const postDuration    = new Trend('post_duration');    // tempo das requisições POST
const getDuration     = new Trend('get_duration');     // tempo das requisições GET
const putDuration     = new Trend('put_duration');     // tempo das requisições PUT
const deleteDuration  = new Trend('delete_duration');  // tempo das requisições DELETE
const totalRequests   = new Counter('total_requests'); // contador total de requisições

// ─────────────────────────────────────────────────────────────
// CONFIGURAÇÃO DO TESTE — 500 USUÁRIOS / 5 MINUTOS
// ─────────────────────────────────────────────────────────────
export const options = {
  scenarios: {
    /**
     * RAMPA DE CARGA
     * Sobe gradualmente até 500 VUs, mantém por 5 min, desce
     */
    ramp_up_500_users: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m',  target: 100 },  // Sobe para 100 em 1 min
        { duration: '1m',  target: 300 },  // Sobe para 300 em 1 min
        { duration: '1m',  target: 500 },  // Sobe para 500 em 1 min
        { duration: '5m',  target: 500 },  // Mantém 500 por 5 min
        { duration: '1m',  target: 0   },  // Desce para 0 em 1 min
      ],
    },

    /**
     * PICO DE CARGA (spike test)
     * Simula pico repentino de tráfego
     */
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      startTime: '5m',  // Começa após 5 min
      stages: [
        { duration: '10s', target: 500 }, // Pico súbito
        { duration: '1m',  target: 500 }, // Mantém pico
        { duration: '10s', target: 0   }, // Queda súbita
      ],
    },
  },

  // ── Thresholds — critérios de aprovação ──────────────────
  thresholds: {
    // 95% das requisições devem responder em menos de 2 segundos
    http_req_duration: ['p(95)<2000'],

    // 99% das requisições devem responder em menos de 5 segundos
    'http_req_duration{type:GET}':    ['p(99)<1500'],
    'http_req_duration{type:POST}':   ['p(99)<2000'],
    'http_req_duration{type:PUT}':    ['p(99)<2000'],
    'http_req_duration{type:DELETE}': ['p(99)<2000'],

    // Taxa de erro deve ser menor que 1%
    error_rate: ['rate<0.01'],

    // Taxa de sucesso deve ser maior que 99%
    success_rate: ['rate>0.99'],

    // Tempo médio de GET deve ser menor que 800ms
    get_duration: ['avg<800', 'p(95)<1500'],
  },
};

// ─────────────────────────────────────────────────────────────
// BASE URL E HEADERS
// ─────────────────────────────────────────────────────────────
const BASE_URL = 'https://jsonplaceholder.typicode.com';

const HEADERS = {
  'Content-Type': 'application/json',
  'Accept':       'application/json',
};

// ─────────────────────────────────────────────────────────────
// SETUP — roda uma vez antes de todos os VUs
// ─────────────────────────────────────────────────────────────
export function setup() {
  console.log('=== Iniciando teste de carga K6 ===');
  console.log(`API: ${BASE_URL}`);
  console.log('Usuários: 500 simultâneos');
  console.log('Duração: 5 minutos sustentados');

  // Verifica se a API está disponível antes de começar
  const res = http.get(`${BASE_URL}/posts/1`);
  if (res.status !== 200) {
    throw new Error(`API não disponível. Status: ${res.status}`);
  }
  console.log('✅ API disponível — iniciando carga');
}

// ─────────────────────────────────────────────────────────────
// FUNÇÃO PRINCIPAL — executada por cada VU em loop
// ─────────────────────────────────────────────────────────────
export default function () {
  // Distribui os usuários em diferentes fluxos
  const scenario = randomIntBetween(1, 4);

  switch (scenario) {
    case 1: flowListarPosts();   break;
    case 2: flowCRUDPost();      break;
    case 3: flowBuscarUsuario(); break;
    case 4: flowComentarios();   break;
  }

  // Pausa realista entre ações (think time)
  sleep(randomIntBetween(1, 3));
}

// ─────────────────────────────────────────────────────────────
// FLUXOS DE USUÁRIO
// ─────────────────────────────────────────────────────────────

/**
 * Fluxo 1 — Listar e ler posts (simula usuário navegando)
 */
function flowListarPosts() {
  group('GET — Listar posts', () => {
    const start = Date.now();
    const res = http.get(`${BASE_URL}/posts`, {
      headers: HEADERS,
      tags: { type: 'GET', flow: 'listar_posts' },
    });
    getDuration.add(Date.now() - start);
    totalRequests.add(1);

    const ok = check(res, {
      'GET /posts — status 200':         r => r.status === 200,
      'GET /posts — tem corpo':           r => r.body.length > 0,
      'GET /posts — retorna array':       r => JSON.parse(r.body).length > 0,
      'GET /posts — content-type JSON':   r => r.headers['Content-Type'].includes('application/json'),
      'GET /posts — responde em <2s':     r => r.timings.duration < 2000,
    });

    errorRate.add(!ok);
    successRate.add(ok);
    sleep(0.5);

    // Lê um post específico após listar
    const postId = randomIntBetween(1, 100);
    const resPost = http.get(`${BASE_URL}/posts/${postId}`, {
      headers: HEADERS,
      tags: { type: 'GET', flow: 'ler_post' },
    });
    getDuration.add(resPost.timings.duration);
    totalRequests.add(1);

    const okPost = check(resPost, {
      'GET /posts/:id — status 200':    r => r.status === 200,
      'GET /posts/:id — tem id':        r => JSON.parse(r.body).id === postId,
      'GET /posts/:id — responde <2s':  r => r.timings.duration < 2000,
    });

    errorRate.add(!okPost);
    successRate.add(okPost);
  });
}

/**
 * Fluxo 2 — CRUD completo de post (simula operações de escrita)
 */
function flowCRUDPost() {
  group('POST/PUT/DELETE — CRUD de post', () => {

    // CREATE
    const startPost = Date.now();
    const resCreate = http.post(
      `${BASE_URL}/posts`,
      JSON.stringify({
        title:  `Post de carga ${Date.now()}`,
        body:   'Conteúdo gerado pelo teste de carga K6',
        userId: randomIntBetween(1, 10),
      }),
      { headers: HEADERS, tags: { type: 'POST', flow: 'criar_post' } }
    );
    postDuration.add(Date.now() - startPost);
    totalRequests.add(1);

    const okCreate = check(resCreate, {
      'POST /posts — status 201':      r => r.status === 201,
      'POST /posts — retorna id':      r => JSON.parse(r.body).id !== undefined,
      'POST /posts — responde <3s':    r => r.timings.duration < 3000,
    });
    errorRate.add(!okCreate);
    successRate.add(okCreate);
    sleep(0.3);

    // UPDATE
    const startPut = Date.now();
    const resUpdate = http.put(
      `${BASE_URL}/posts/1`,
      JSON.stringify({
        id:     1,
        title:  'Título atualizado pelo K6',
        body:   'Body atualizado pelo teste de carga',
        userId: 1,
      }),
      { headers: HEADERS, tags: { type: 'PUT', flow: 'atualizar_post' } }
    );
    putDuration.add(Date.now() - startPut);
    totalRequests.add(1);

    const okUpdate = check(resUpdate, {
      'PUT /posts/1 — status 200':     r => r.status === 200,
      'PUT /posts/1 — retorna título': r => JSON.parse(r.body).title !== undefined,
      'PUT /posts/1 — responde <3s':   r => r.timings.duration < 3000,
    });
    errorRate.add(!okUpdate);
    successRate.add(okUpdate);
    sleep(0.3);

    // DELETE
    const startDel = Date.now();
    const resDelete = http.del(
      `${BASE_URL}/posts/1`,
      null,
      { headers: HEADERS, tags: { type: 'DELETE', flow: 'deletar_post' } }
    );
    deleteDuration.add(Date.now() - startDel);
    totalRequests.add(1);

    const okDelete = check(resDelete, {
      'DELETE /posts/1 — status 200':  r => r.status === 200,
      'DELETE /posts/1 — responde <3s': r => r.timings.duration < 3000,
    });
    errorRate.add(!okDelete);
    successRate.add(okDelete);
  });
}

/**
 * Fluxo 3 — Buscar usuário e seus posts (simula perfil)
 */
function flowBuscarUsuario() {
  group('GET — Perfil de usuário', () => {
    const userId = randomIntBetween(1, 10);

    // Busca o usuário
    const resUser = http.get(`${BASE_URL}/users/${userId}`, {
      headers: HEADERS,
      tags: { type: 'GET', flow: 'buscar_usuario' },
    });
    getDuration.add(resUser.timings.duration);
    totalRequests.add(1);

    const okUser = check(resUser, {
      'GET /users/:id — status 200':  r => r.status === 200,
      'GET /users/:id — tem email':   r => JSON.parse(r.body).email !== undefined,
      'GET /users/:id — responde <2s': r => r.timings.duration < 2000,
    });
    errorRate.add(!okUser);
    successRate.add(okUser);
    sleep(0.5);

    // Busca os posts do usuário
    const resPosts = http.get(`${BASE_URL}/posts?userId=${userId}`, {
      headers: HEADERS,
      tags: { type: 'GET', flow: 'posts_usuario' },
    });
    getDuration.add(resPosts.timings.duration);
    totalRequests.add(1);

    const okPosts = check(resPosts, {
      'GET /posts?userId — status 200':       r => r.status === 200,
      'GET /posts?userId — retorna lista':    r => Array.isArray(JSON.parse(r.body)),
      'GET /posts?userId — userId correto':   r => JSON.parse(r.body).every(p => p.userId === userId),
    });
    errorRate.add(!okPosts);
    successRate.add(okPosts);
  });
}

/**
 * Fluxo 4 — Buscar comentários de um post
 */
function flowComentarios() {
  group('GET — Comentários', () => {
    const postId = randomIntBetween(1, 100);

    const res = http.get(`${BASE_URL}/comments?postId=${postId}`, {
      headers: HEADERS,
      tags: { type: 'GET', flow: 'comentarios' },
    });
    getDuration.add(res.timings.duration);
    totalRequests.add(1);

    const ok = check(res, {
      'GET /comments — status 200':       r => r.status === 200,
      'GET /comments — retorna lista':    r => Array.isArray(JSON.parse(r.body)),
      'GET /comments — tem email':        r => JSON.parse(r.body)[0]?.email !== undefined,
      'GET /comments — responde <2s':     r => r.timings.duration < 2000,
    });
    errorRate.add(!ok);
    successRate.add(ok);
  });
}

// ─────────────────────────────────────────────────────────────
// TEARDOWN — roda uma vez após todos os VUs
// ─────────────────────────────────────────────────────────────
export function teardown() {
  console.log('=== Teste de carga finalizado ===');
  console.log('Verifique o relatório em reports/results.json');
}
