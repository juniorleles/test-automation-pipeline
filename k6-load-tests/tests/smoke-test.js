/**
 * K6 Smoke Test — Validação rápida (1 VU, 30s)
 * Roda antes do teste de carga para garantir que a API está OK
 *
 * Execução: k6 run tests/smoke-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus:      1,
  duration: '30s',
  thresholds: {
    http_req_failed:   ['rate<0.01'],
    http_req_duration: ['p(99)<1000'],
  },
};

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export default function () {
  // GET
  const get = http.get(`${BASE_URL}/posts/1`);
  check(get, {
    'smoke GET — status 200':    r => r.status === 200,
    'smoke GET — responde <1s':  r => r.timings.duration < 1000,
  });
  sleep(1);

  // POST
  const post = http.post(
    `${BASE_URL}/posts`,
    JSON.stringify({ title: 'smoke', body: 'test', userId: 1 }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(post, {
    'smoke POST — status 201':   r => r.status === 201,
    'smoke POST — responde <2s': r => r.timings.duration < 2000,
  });
  sleep(1);
}
