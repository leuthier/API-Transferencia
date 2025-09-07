const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../graphql/app'); // Ajuste o caminho se necessário

// Helper para obter token JWT
async function getToken(email, password) {
  const query = `mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }`;
  const res = await request(app)
    .post('/graphql')
    .send({
      query,
      variables: { 
        email,
        password
      }
    });
  return res.body.data.login.token;
}

describe('Transfer - External GraphQL', () => {
    describe('Mutation Transfer', function () {
        var token;
        before(async function () {
            token = await getToken('string', 'string');
        });

        it('Transferência realizada sucesso', async function () {
            const mutation = `mutation Transfer($fromEmail: String!, $toEmail: String!, $amount: Float!) {
            transfer(fromEmail: $fromEmail, toEmail: $toEmail, amount: $amount) {
                id
                from { id email }
                to { id email }
                amount
                createdAt
            }
            }`;
            const variables = {
              fromEmail: 'string',
              toEmail: 'victor@leuth.com',
              amount: 10
            };
            const res = await request(app)
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({ query: mutation, variables });
            expect(res.body.data.transfer).to.have.property('id');
            expect(res.body.data.transfer.amount).to.equal(10);
            expect(res.body.errors).to.be.undefined;
        });

        it('Conta sem saldo disponível para transferência', async function () {
            const res = await request(app)
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({ query: `
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
                        }`, 
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
            const mutation = `mutation Transfer($fromEmail: String!, $toEmail: String!, $amount: Float!) {
            transfer(fromEmail: $fromEmail, toEmail: $toEmail, amount: $amount) {
                id
            }
            }`;
            const variables = {
            fromEmail: 'string',
            toEmail: 'victor@leuth.com',
            amount: 10
            };
            const res = await request(app)
            .post('/graphql')
            .send({ query: mutation, variables });
            expect(res.body.data.transfer).to.be.null;
            expect(res.body.errors[0].message).to.match(/Token inválido/);
        });
    });
});
