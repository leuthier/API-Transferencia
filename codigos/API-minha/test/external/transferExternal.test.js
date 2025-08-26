const request = require('supertest');
const { expect } = require('chai');
const API = 'http://localhost:3000';

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
    
        it('Quando informo mesmo id remetente e destinatario recebo 400', async () => {
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

        it('Quando informo usuários existentes e valor positivo eu tenho sucesso com 201', async () => {
            const resposta = await request(API)
                .post('/transfers')
                .send({
                    fromId: "eb2d3111-4f9b-4bbe-88ec-89c623c49a46",
                    toId: "84e47cef-4783-4398-9d72-6eed9d67bf8e",
                    amount: 100
                });
            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.have.property('from');
            expect(resposta.body.from).to.have.property('id', 'eb2d3111-4f9b-4bbe-88ec-89c623c49a46');
            expect(resposta.body.to).to.have.property('id', '84e47cef-4783-4398-9d72-6eed9d67bf8e');
            expect(resposta.body).to.have.property('transfer');
            expect(resposta.body.transfer).to.have.property('id');
            expect(resposta.body.transfer).to.have.property('amount', 100);
        });

        it('Quando informo valor negativo para transferir recebo 400', async () => {
            const resposta = await request(API)
                .post('/transfers')
                .send({
                    fromId: "eb2d3111-4f9b-4bbe-88ec-89c623c49a46",
                    toId: "84e47cef-4783-4398-9d72-6eed9d67bf8e",
                    amount: -10
                });
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('O valor deve ser maior que zero');
        });

    });
});