import { sleep, check, group } from 'k6';
import { SharedArray } from 'k6/data';
import http from 'k6/http';
import { Trend } from 'k6/metrics';
import { postCall } from './helpers/apiCalls.js';
import { getBaseUrl } from './helpers/baseUrl.js';
import { login } from './helpers/login.js';
import { generateRandomUser } from './helpers/userFaker.js';


const BASE_URL = getBaseUrl();
const users = new SharedArray('users', function() {
  return JSON.parse(open('./data/login.test.data.json'));
});

const user_transfer = JSON.parse(open('./data/transferToAndre.test.data.json'));

export const options = {
  vus: 5,
  thresholds: {
    http_req_duration: ['p(90)<=220', 'p(95)<=290'], // 90% of requests must complete below 220ms and 95% below 290ms
    http_req_failed: ['rate<0.1'], // Error rate must be less than 5%
  },
  stages: [
    { duration: '3s', target: 5 }, // Ramp up
    { duration: '10s', target: 5 }, // Average
    { duration: '2s', target: 30 }, // Spike to 30 users
    { duration: '3s', target: 30 }, // Spike hold
    { duration: '5s', target: 5 },  // Average
    { duration: '5s', target: 0 }  // Ramp down
  ]
};

const TransferTrend = new Trend('transfer_duration');

export default function() {
  let email, password, token;
  let user = users[(__VU - 1) % users.length]; // Users are reused if the number of VUs exceeds the user pool
  
  group('Register', function() {
    const randomUser = generateRandomUser();
    email = randomUser.email;
    password = randomUser.password;

    const res = postCall('/users', randomUser);

    check(res, {
      'REGISTER - Status is 201': (r) => r.status === 201,
      'REGISTER - Has id': (r) => !!r.json('id'),
    });
  });

  group('Login', function () {
    token = login(user.email, user.password);

    check(token, {
      'LOGIN - Token exists': (t) => !!t
    });

  });

  group('Transfer', function() {
    const url = `${BASE_URL}/transfers`;
    const payload = JSON.stringify({
      fromEmail: user.email,
      toEmail: user_transfer.toEmail,
      amount: user_transfer.amount
    })
    const params = {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
    }

    const responseTransfer = http.post(
      url,
      payload,
      params
    );

      check(responseTransfer, {
        'TRANSFER - Status should be 201': (res) => res.status === 201
      });

      const start = Date.now();
      const duration = Date.now() - start;
      TransferTrend.add(duration);
  })

  // cmd - npm run start-rest
  // cmd - k6 run test/k6/finalWork.k6test.js
  // gitbash
  // K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_OPEN=true K6_WEB_DASHBOARD_EXPORT=docs/k6/reports/finalWork_stages-html-report.html K6_WEB_DASHBOARD_PERIOD=2s k6 run test/k6/finalWorkStages.k6test.js
  
  
  sleep(1);
}