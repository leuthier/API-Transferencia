import { sleep, check, group } from 'k6';
import http from 'k6/http';
import { getBaseUrl } from './helpers/baseUrl.js';
import { login } from './helpers/login.js';
import { generateRandomUser } from './helpers/userFaker.js';
import { postCall } from './helpers/apiCalls.js';


const BASE_URL = getBaseUrl();
const users = JSON.parse(open('./data/login.test.data.json'));
const user_transfer = JSON.parse(open('./data/transferToAndre.test.data.json'));

export const options = {
  vus: 1,
  duration: '15s',
  iterations: 10,
  thresholds: {
    http_req_duration: ['p(90)<=220', 'p(95)<=290'], // 90% of requests must complete below 220ms and 95% below 290ms
    http_req_failed: ['rate<0.05'], // Error rate must be less than 5%
  }
};


export default function() {
  let email, password, token;
  
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
    token = login(email, password);

    check(token, {
      'LOGIN - Token exists': (t) => !!t
    });

  });

  group('Transfer', function() {
    const user = users[(__VU - 1) % users.length]; // Users are reused if the number of VUs exceeds the user pool
    token = login(user.email, user.password);
    const responseTransfer = http.post(
      `${BASE_URL}/transfers`, 
      JSON.stringify({
          fromEmail: user.email,
          toEmail: user_transfer.toEmail,
          amount: user_transfer.amount
      }),
      {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      });

      check(responseTransfer, {
        'TRANSFER - Status should be 201': (res) => res.status === 201
      });
  })

  // cmd - npm run start-rest
  // cmd - k6 run test/k6/finalWork.k6test.js
  // gitbash
  // K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_OPEN=true K6_WEB_DASHBOARD_EXPORT=docs/k6/reports/finalWork_iterations-html-report.html K6_WEB_DASHBOARD_PERIOD=2s k6 run test/k6/finalWorkIterations.k6test.js
  
  
  sleep(1);
}