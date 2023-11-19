import http from 'k6/http';
import { check } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";


export const options = {
  thresholds: {
    http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true }],
    http_req_duration: [{ threshold: 'p(95)<250', abortOnFail: true }],
    checks: ['rate>0.9'],
  },
  scenarios: {
    stress_test: {
      executor: 'ramping-arrival-rate',
      preAllocatedVUs: 50,
    stages: [
     { duration: '2m', target: 300 },
     { duration: '4m', target: 300 },
     { duration: '1m', target: 0 },
    ],
  },
 },
};

export default function () {
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

export function handleSummary(data) {
  console.log('Finished executing performance tests');

  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: false }),
    'summary.txt': textSummary(data, { indent: ' ', enableColors: false }),
    "result.html": htmlReport(data),
  };
}