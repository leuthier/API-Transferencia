const request = require('supertest');
const { expect } = require('chai');
const { validate: isUuid } = require('uuid');
const API = 'http://localhost:3000';
let token;

beforeEach(async () => {
     // 1 - Capturar token
    const res = await request(API)
        .post('/auth/login')
        .send({
            email: "string",
            password: "string"
        });
    token = res.body.token;
});

describe('Transfer - External', () => {
    describe('POST /transfers', () => {
        it('Quando informo destinatario inexistente recebo 400', async () => {
            // 2 - Usar token na requisição de transferência
            const resposta = await request(API)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    fromEmail: "string",
                    toEmail: "victor@gmail.com",
                    amount: 100
                });
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Usuário remetente ou destinatário não encontrado');
        });
    
        it('Quando informo mesmo id remetente e destinatario recebo 400', async () => {
            const resposta = await request(API)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    fromEmail: "string",
                    toEmail: "string",
                    amount: 100
                });
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Não é possível transferir para si mesmo');
        });

        it('Quando informo usuários existentes e valor positivo eu tenho sucesso com 201', async () => {
            const resposta = await request(API)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    fromEmail: "string",
                    toEmail: "victor@leuth.com",
                    amount: 1
                });
            const createdAt = resposta.body.createdAt;
            const dateObject = new Date(createdAt);
            expect(resposta.status).to.equal(201);
            expect(isUuid(resposta.body.id)).to.be.true;
            expect(resposta.body).to.have.property( 'amount', 1);
            expect(resposta.body).to.have.property('createdAt');
            // Verifica se createdAt é uma data ISO 8601 válida
            expect(dateObject.toISOString()).to.equal(createdAt);
            expect(resposta.body.from).to.have.property('id', 'b81a5ae0-32fc-43b0-8f33-dbe419cd6033');
            expect(resposta.body.from).to.have.property('email', 'string');
            expect(resposta.body.to).to.have.property('id', '84e47cef-4783-4398-9d72-6eed9d67bf8e');
            expect(resposta.body.to).to.have.property('email', 'victor@leuth.com');
        });

        it('Quando informo valor negativo para transferir recebo 400', async () => {
            const resposta = await request(API)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    fromEmail: "string",
                    toEmail: "andre@gmail.com",
                    amount: -10
                });
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('O valor deve ser maior que zero');
        });

        it('Quando tento transferir valores de uma conta que não é a minha recebo 403', async () => {
            const resposta = await request(API)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    fromEmail: "victor@leuth.com",
                    toEmail: "andre@gmail.com",
                    amount: 10
                });
            expect(resposta.status).to.equal(403);
            expect(resposta.body.error).to.equal('Você só pode transferir valores da sua própria conta');
        });

    });
});