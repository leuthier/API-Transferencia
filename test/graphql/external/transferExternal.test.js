const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../graphql/app'); // Ajuste o caminho se necessário



describe('Transfer - External GraphQL', () => {
  
  // Before each not need to login because the token is valid for all tests. Only expires after 1h and tests are running within 1s.
  
  before(async () => { 
    const loginUser = require('../fixture/request/login/loginUser.json');
    const resposta = await request(app)
      .post('/graphql')
      .send(loginUser);

    token = await resposta.body.data.login.token;
    });

    describe('Mutation Transfer', function () {
        it('Transferência realizada sucesso', async function () {
            const res = await request(app)
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
              query: `
                mutation Transfer($fromEmail: String!, $toEmail: String!, $amount: Float!) {
                  transfer(fromEmail: $fromEmail, toEmail: $toEmail, amount: $amount) {
                    id
                    from { id email }
                    to { id email }
                    amount
                    createdAt
                  }
                }
              `,
              variables: {
                fromEmail: 'string',
                toEmail: 'victor@leuth.com',
                amount: 10
              }
            });
            expect(res.body.data.transfer).to.have.property('id');
            expect(res.body.data.transfer.amount).to.equal(10);
            expect(res.body.errors).to.be.undefined;
        });

        it('Conta sem saldo disponível para transferência', async function () {
            const res = await request(app)
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
              query: `
                mutation Transfer($fromEmail: String!, $toEmail: String!, $amount: Float!) {
                  transfer(fromEmail: $fromEmail, toEmail: $toEmail, amount: $amount) {
                    id
                    from {
                      id
                      email
                    }
                    to {
                      id
                      email
                    }
                    amount
                    createdAt
                  }
                }
              `, 
              variables: {
                fromEmail: 'string',
                toEmail: 'victor@leuth.com',
                amount: 101 // Total maior que o disponível em \src\models\userModel.js
              }
             });
            expect(res.body.data.transfer).to.be.null;
            expect(res.body.errors[0].message).to.match(/Saldo insuficiente/);
        });

        it('Token de autenticação não informado', async function () {
            const res = await request(app)
            .post('/graphql')
            .send({
              query: `
                mutation Transfer($fromEmail: String!, $toEmail: String!, $amount: Float!) {
                  transfer(fromEmail: $fromEmail, toEmail: $toEmail, amount: $amount) {
                    id
                  }
                }
              `,
              variables: {
                fromEmail: 'string',
                toEmail: 'victor@leuth.com',
                amount: 10
                }
            });
            expect(res.body.data.transfer).to.be.null;
            expect(res.body.errors[0].message).to.match(/Token inválido/);
        });
    });
});
