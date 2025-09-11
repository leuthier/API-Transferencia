// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

// Aplicação
const app = require('../../../app');

// Mock
const transferService = require('../../../src/services/transferService');

// Testes
describe('Transfer Controller - Mock', () => {
    before(async () => {
        const login = await request(app)
            .post('/auth/login')
            .send({
                email: 'string',
                password: 'string'
            });
        token = login.body.token;
    });

    beforeEach(() => {
        sinon.restore();
    });
    
    describe('POST /transfers', () => {
        it('Quando informo remetente e destinatario inexistentes recebo 400', async () => {
            // Mocar apenas a função transfer do Service
            const transferServiceMock = sinon.stub(transferService, 'transfer');
            transferServiceMock.throws(new Error('Usuário remetente ou destinatário não encontrado'));

            // Fazer a requisição
            const resposta = await request(app)
                .post('/transfers')
                .set('Authorization',`Bearer ${token}`)
                .send({
                    fromEmail: "string",
                    toEmail: "leut",
                    amount: 100
                });
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Usuário remetente ou destinatário não encontrado');
        });

        it('Quando informo valores válidos eu tenho sucesso com 201 CREATED', async () => {
            const transferServiceMock = sinon.stub(transferService, 'transfer');
            transferServiceMock.returns({
                transfer: {
                    id: 'fake-transfer-id',
                    from: {
                        id: 'fake-string-id',
                        email: 'string',
                    },
                    to: {
                        id: 'fake-victor-id',
                        email: 'victor@leuth.com',
                    },
                    amount: 100,
                    createdAt: '2025-08-25T01:41:19.859Z'
                }
            });

            const resposta = await request(app)
                .post('/transfers')
                .set('Authorization',`Bearer ${token}`)
                .send({
                    fromEmail: "string",
                    toEmail: "victor@leuth.com",
                    amount: 100
                });
            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.have.property('transfer');
            expect(resposta.body.transfer.from).to.have.property('email', 'string');
            expect(resposta.body.transfer.to).to.have.property('email', 'victor@leuth.com');
            expect(resposta.body.transfer).to.have.property('id', 'fake-transfer-id');
            expect(resposta.body.transfer).to.have.property('amount', 100);
            expect(resposta.body.transfer).to.have.property('createdAt', '2025-08-25T01:41:19.859Z');
        });

        it('Quando informo mesmo id remetente e destinatario recebo 400', async () => {
            const transferServiceMock = sinon.stub(transferService, 'transfer');
            transferServiceMock.throws(new Error('Não é possível transferir para si mesmo'));

            const resposta = await request(app)
                .post('/transfers')
                .set('Authorization',`Bearer ${token}`)
                .send({
                    fromEmail: "string",
                    toEmail: "string",
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
                .set('Authorization',`Bearer ${token}`)
                .send({
                    fromEmail: "string",
                    toEmail: "andre@gmail.com",
                    amount: -1
                });
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('O valor deve ser maior que zero');
        });

        it('Quando não informo o Token, deve retornar 401', async () => {
            const resposta = await request(app)
                .post('/transfers')
                .send({
                    fromEmail: 'string',
                    toEmail: 'andre@gmail.com',
                    amount: 10
                });
            expect(resposta.status).to.equal(401);
            expect(resposta.body).to.have.property('error', 'Token não fornecido');
        });

        it('Quando token for inválido, deve retornar 401', async () => {
        const resposta = await request(app)
            .post('/transfers')
            .set('Authorization', 'Bearer token-invalido')
            .send({
                fromId: 'user1',
                toId: 'user2',
                amount: 100
            });
        expect(resposta.status).to.equal(401);
        expect(resposta.body).to.have.property('error', 'Token inválido');
    });

    });

    describe('GET /transfers', () => {
        it('Deve retornar lista de transferências', async () => {
            const mockTransfers = [
                { id: 't1',
                    from: {
                        id: 'user1',
                        email: 'email1'
                    },
                    to: {
                        id: 'u2',
                        email: 'email2' 
                    },
                    amount: 100,
                    createdAt: '2025-08-23T10:00:00Z'
                },
                { id: 't2',
                    from: {
                        id: 'u2',
                        email: 'email2'
                    },
                    to: {
                        id: 'u3',
                        email: 'email3'
                    }, amount: 200,
                    createdAt: '2025-08-23T11:00:00Z'
                }
            ];
            sinon.stub(transferService, 'listTransfers').returns(mockTransfers);
            
            const resposta = await request(app)
                .get('/transfers')
                .set('Authorization', `Bearer ${token}`);
            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.be.an('array').with.lengthOf(2);
            expect(resposta.body[0]).to.have.property('id', 't1');
            expect(resposta.body[1]).to.have.property('id', 't2');
        });
    });

});