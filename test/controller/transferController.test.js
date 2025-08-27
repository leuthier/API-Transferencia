// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

// Aplicação
const app = require('../../app');

// Mock
const transferService = require('../../src/services/transferService');

// Testes
describe('Transfer Controller - Mock', () => {
    afterEach(() => {
        sinon.restore();
    });
    
    describe('POST /transfers', () => {
        it('Quando informo remetente e destinatario inexistentes recebo 400', async () => {
            // Mocar apenas a função transfer do Service
            const transferServiceMock = sinon.stub(transferService, 'transfer');
            transferServiceMock.throws(new Error('Usuário remetente ou destinatário não encontrado'));

            const resposta = await request(app)
                .post('/transfers')
                .send({
                    fromId: "victor",
                    toId: "leut",
                    amount: 100
                });
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Usuário remetente ou destinatário não encontrado');
        });

        it('Quando informo valores válidos eu tenho sucesso com 201 CREATED', async () => {
            const transferServiceMock = sinon.stub(transferService, 'transfer');
            transferServiceMock.returns({
                from: { id: 'victor', balance: 900 },
                to: { id: 'leut', balance: 1100 },
                transfer: {
                    id: 'fake-transfer-id',
                    fromId: 'victor',
                    toId: 'leut',
                    amount: 100,
                    createdAt: new Date().toISOString()
                }
            });

            const resposta = await request(app)
                .post('/transfers')
                .send({
                    fromId: "victor",
                    toId: "leut",
                    amount: 100
                });
            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.have.property('from');
            expect(resposta.body.from).to.have.property('id', 'victor');
            expect(resposta.body.to).to.have.property('id', 'leut');
            expect(resposta.body).to.have.property('transfer');
            expect(resposta.body.transfer).to.have.property('id', 'fake-transfer-id');
            expect(resposta.body.transfer).to.have.property('amount', 100);
            expect(resposta.body.transfer).to.have.property('createdAt', '2025-08-25T01:41:19.859Z');
        });

        it('Quando informo mesmo id remetente e destinatario recebo 400', async () => {
            const transferServiceMock = sinon.stub(transferService, 'transfer');
            transferServiceMock.throws(new Error('Não é possível transferir para si mesmo'));

            const resposta = await request(app)
                .post('/transfers')
                .send({
                    fromId: "victor",
                    toId: "victor",
                    amount: 100
                });
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Não é possível transferir para si mesmo');
        });

        it('Quando informo valor negativo recebo 400', async () => {
            const transferServiceMock = sinon.stub(transferService, 'transfer');
            transferServiceMock.throws(new Error('O valor deve ser maior que zero'));

            const resposta = await request(app)
                .post('/transfers')
                .send({
                    fromId: "victor",
                    toId: "leut",
                    amount: -1
                });
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('O valor deve ser maior que zero');
        });

    });

    describe('GET /transfers', () => {
        it('Deve retornar lista de transferências', async () => {
            const mockTransfers = [
                { id: 't1', fromId: 'u1', toId: 'u2', amount: 100, createdAt: '2025-08-23T10:00:00Z' },
                { id: 't2', fromId: 'u2', toId: 'u3', amount: 200, createdAt: '2025-08-23T11:00:00Z' }
            ];
            sinon.stub(transferService, 'listTransfers').returns(mockTransfers);
            const resposta = await request(app).get('/transfers');
            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.be.an('array').with.lengthOf(2);
            expect(resposta.body[0]).to.have.property('id', 't1');
            expect(resposta.body[1]).to.have.property('id', 't2');
        });
    });

});