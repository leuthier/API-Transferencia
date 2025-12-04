import http from 'k6/http';
import { sleep, check, group } from 'k6';

// k6 does not support importing JSON modules directly. Use open() and JSON.parse()
// Paths are relative to this script file.
const user_string = JSON.parse(open('../fixture/request/loginUsuarioString.json'));
const user_transfer = JSON.parse(open('../fixture/request/transferirDeStringParaAndre.json'));

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
  group('Fazendo login', function() {
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
    //console.log('Login Body: ' + responseLoginUser.body);
    check(responseLoginUser, {
      'Login bem sucedido! Status deve ser 200': (res) => res.status === 200
    });
  })

  group('Fazendo transferencia', function() {
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
        'Transferencia criada com sucesso! Status deve ser 201': (res) => res.status === 201
      });
  })

  // cmd - npm run start-rest
  // cmd - k6 run test/rest/k6/desafio2.js
  // gitbash
  // K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_OPEN=true K6_WEB_DASHBOARD_EXPORT=test/rest/k6/reports/dashboard-report.html K6_WEB_DASHBOARD_PERIOD=2s k6 run test/rest/k6/desafio2.js
  
  
  sleep(1);
}