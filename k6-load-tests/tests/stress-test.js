/**
 * K6 Stress Test — Encontrar limite da API
 * Aumenta carga além do esperado para identificar ponto de quebra
 *
 * Execução: k6 run tests/stress-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('error_rate');

export const options = {
  stages: [
    { duration: '2m',  target: 100  },
    { duration: '2m',  target: 200  },
    { duration: '2m',  target: 400  },
    { duration: '2m',  target: 600  },  // Acima do normal
    { duration: '2m',  target: 800  },  // Stress
    { duration: '2m',  target: 1000 },  // Limite extremo
    { duration: '2m',  target: 0    },  // Recuperação
  ],
  thresholds: {
    http_req_duration: ['p(99)<5000'],
    error_rate:        ['rate<0.10'],   // Aceita até 10% de erro no stress
  },
};

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export default function () {
  const res = http.get(`${BASE_URL}/posts/${Math.floor(Math.random() * 100) + 1}`);

  const ok = check(res, {
    'status 200':      r => r.status === 200,
    'responde <5s':    r => r.timings.duration < 5000,
  });

  errorRate.add(!ok);
  sleep(1);
}
