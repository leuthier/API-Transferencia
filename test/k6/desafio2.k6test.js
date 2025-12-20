import http from 'k6/http';
import { sleep, check, group } from 'k6';

// k6 does not support importing JSON modules directly. Use open() and JSON.parse()
// Paths are relative to this script file.
const users = JSON.parse(open('./data/login.test.data.json'));
const user_string = users[0];
const user_transfer = JSON.parse(open('./data/transferFromStringToAndre.test.data.json'));

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(90)<=140', 'p(95)<=150'], // 90% of requests must complete below 140ms and 95% below 150ms
    http_req_failed: ['rate<0.1'], // error rate must be less than 10%
  }
};

const BASE_URL = 'http://localhost:3000';

export default function() {
let responseLoginUser = ''
  group('Login', function() {
    responseLoginUser = http.post(
      `${BASE_URL}/auth/login`, 
      JSON.stringify({
          email: user_string.email,
          password: user_string.password
      }),
      {
          headers: {
              'Content-Type': 'application/json'
          },
    });
    // console.log('Login Body: ' + responseLoginUser.body);
    check(responseLoginUser, {
      'Login done! Status should 200': (res) => res.status === 200
    });
  })

  group('Transfering', function() {
    const responseTransfer = http.post(
      `${BASE_URL}/transfers`, 
      JSON.stringify({
          fromEmail: user_transfer.fromEmail,
          toEmail: user_transfer.toEmail,
          amount: user_transfer.amount
      }),
      {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${responseLoginUser.json('token')}`
          }
      });

      //console.log('Transfer Body: ' + responseTransfer.body);
      check(responseTransfer, {
        'Transfer done! Status should be ser 201': (res) => res.status === 201
      });
  })

  // cmd - npm run start-rest
  // cmd - k6 run test/k6/desafio2.k6test.js
  // gitbash
  // K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_OPEN=true K6_WEB_DASHBOARD_EXPORT=test/k6/reports/desafio2-html-report.html K6_WEB_DASHBOARD_PERIOD=2s k6 run test/k6/desafio2.k6test.js
  
  
  sleep(1);
}