import http from 'k6/http';
import { check } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  discardResponseBodies: true,
  thresholds: {
    http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true }],
    http_req_duration: [{ threshold: 'p(95)<250', abortOnFail: true }],
    checks: ['rate>0.9'],
  },
  scenarios: {
   breakpoint_test: {
      executor: 'ramping-arrival-rate',
	  preAllocatedVUs: 350,
    stages: [
     { duration: '15m', target: 3000 },
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
