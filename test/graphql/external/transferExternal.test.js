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
            const transferRequest = require('../fixture/request/transfer/createTransfer.json');
            const res = await request(app)
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send(transferRequest);
            expect(res.body.data.transfer).to.have.property('id');
            expect(res.body.data.transfer.amount).to.equal(10);
            expect(res.body.errors).to.be.undefined;
        });

        it('Conta sem saldo disponível para transferência', async function () {
          const transferRequest = require('../fixture/request/transfer/createTransfer.json');  
          transferRequest.variables.amount = 101;
          const res = await request(app)
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send(transferRequest);
            expect(res.body.data.transfer).to.be.null;
            expect(res.body.errors[0].message).to.match(/Saldo insuficiente/);
        });

        it('Token de autenticação não informado', async function () {
            const transferRequest = require('../fixture/request/transfer/createTransfer.json');
            const res = await request(app)
            .post('/graphql')
            .send(transferRequest);
            expect(res.body.data.transfer).to.be.null;
            expect(res.body.errors[0].message).to.match(/Token inválido/);
        });
    });
});
