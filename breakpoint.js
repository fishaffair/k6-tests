import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  discardResponseBodies: true,
  thresholds: {
    http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true}],
    http_req_duration: [{ threshold: 'p(95)<250', abortOnFail: false }],
    checks: ['rate>0.9'],
  },
  stages: [
    { duration: '30m', target: 10000 }, 
  ],
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
