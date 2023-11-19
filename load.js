import http from 'k6/http';
import { check } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  thresholds: {
    http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true }],
    http_req_duration: [{ threshold: 'p(95)<250', abortOnFail: true }],
    checks: ['rate>0.9'],
  },
  scenarios: {
    reads: {
      executor: 'ramping-arrival-rate',
      preAllocatedVUs: 50,
      exec: 'reads',
    stages: [
     { duration: '5m', target: 500 },
     { duration: '15m', target: 500 },
     { duration: '5m', target: 0 },
    ],
   },
    writes: {
      executor: 'constant-arrival-rate',
      duration: '25m',
      rate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 1,
      exec: 'writes',
   },
  },
};

export function reads() {
  const url = `http://${__ENV.API_IP}/WeatherForecast`;
  const params = {
    headers: {
      'Host': 'app.test',
      'accept':'application/json',
    },
  };
  check(http.get(url, params), {
    'status 200': (r) => r.status === 200,
     'correct api response': (r) =>
      r.body.includes('temperature'),
  });
}

export function writes() {
  const randomSummary = randomString(5);
  const randomTemp = randomIntBetween(0, 40);
  const url = `http://${__ENV.API_IP}/Forecast/3`;
  const data = { "id": 3, "cityId": 3, "dateTime": 10, "temperature": `${randomTemp}`, "summary": `${randomSummary}` }
  const params = {
    headers: {
      'Host': 'app.test',
      'Content-Type': 'application/json',
    },
  };
  check(http.put(url, JSON.stringify(data), params), {
    'status 200': (r) => r.status === 200,
  });
}

export function handleSummary(data) {
  console.log('Finished executing performance tests');
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: false }),
    'summary.txt': textSummary(data, { indent: ' ', enableColors: false }),
    "result.html": htmlReport(data),
  };
}