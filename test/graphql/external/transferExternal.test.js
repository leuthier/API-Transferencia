const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../graphql/app');
require('dotenv').config();

const chai = require('chai');
const chaiExclude = require('chai-exclude');
chai.use(chaiExclude);



describe('Transfer - External GraphQL', () => {
  
  // Before each not need to login because the token is valid for all tests. Only expires after 1h and tests are running within 1s.
  
  before(async () => { 
    const loginUser = require('../fixture/request/login/loginUser.json');
    const resposta = await request(process.env.BASE_URL_GRAPHQL)
      .post('/graphql')
      .send(loginUser);

    token = await resposta.body.data.login.token;
    });

  beforeEach(() => {
    transferRequest = require('../fixture/request/transfer/createTransfer.json');
  });

    describe('Mutation Transfer', function () {
        it('Transferência realizada sucesso', async function () {
            const expectedResponse = require('../fixture/response/transfer/transferSuccess.json');
            const res = await request(process.env.BASE_URL_GRAPHQL)
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send(transferRequest);
            
            expect(res.body.data.transfer)
              .excluding(['id', 'createdAt']) // Exclude dynamic fields
              .to.deep.equal(expectedResponse.data.transfer)

            // expect(res.body.data.transfer).to.have.property('id');  
            // expect(res.body.data.transfer).to.have.property('createdAt');  
            // expect(res.body.data.transfer.amount).to.equal(10);
            expect(res.body.errors).to.be.undefined;
        });

        it('Conta sem saldo disponível para transferência', async function () {  
          transferRequest.variables.amount = 101;
          const res = await request(process.env.BASE_URL_GRAPHQL)
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send(transferRequest);
            expect(res.body.data.transfer).to.be.null;
            expect(res.body.errors[0].message).to.match(/Saldo insuficiente/);
        });

        it('Token de autenticação não informado', async function () {
            const res = await request(process.env.BASE_URL_GRAPHQL)
            .post('/graphql')
            .send(transferRequest);
            expect(res.body.data.transfer).to.be.null;
            expect(res.body.errors[0].message).to.match(/Token inválido/);
        });

        it('Token de autenticação expirado', async function () {
            const invalidToken = require('../fixture/request/auth/expiredToken.json');
            const res = await request(process.env.BASE_URL_GRAPHQL)
            .post('/graphql')
            .set('Authorization', `Bearer ${invalidToken}`)
            .send(transferRequest);
            expect(res.body.data.transfer).to.be.null;
            expect(res.body.errors[0].message).to.match(/Token inválido/);
        });

    });
});
