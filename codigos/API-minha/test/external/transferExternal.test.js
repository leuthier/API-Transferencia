// Bibliotecas
const request = require('supertest');
const { expect } = require('chai');
const API = 'http://localhost:3000';

// Testes
describe('Transfer - External', () => {
    describe('POST /transfers', () => {
        it('Quando informo remetente e destinatario inexistentes recebo 400', async () => {
            const resposta = await request(API)
                .post('/transfers')
                .send({
                    fromId: "1",
                    toId: "2",
                    amount: 100
                });
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Usuário remetente ou destinatário não encontrado');
        });
    });

    describe('POST /transfers', () => {
        it('Quando informo mesmo id remetente e destinatario recebo ', async () => {
            const resposta = await request(API)
                .post('/transfers')
                .send({
                    fromId: "eb2d3111-4f9b-4bbe-88ec-89c623c49a46",
                    toId: "eb2d3111-4f9b-4bbe-88ec-89c623c49a46",
                    amount: 100
                });
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Não é possível transferir para si mesmo');
        });
    });
});
