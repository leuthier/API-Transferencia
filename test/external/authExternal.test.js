const request = require('supertest');
const { expect } = require('chai');
const API = 'http://localhost:3000';


describe('Auth - External', () => {
    describe('POST /auth/login', () => {
        it('Quando não informo email e senha recebo 400', async () => {
            const resposta = await request(API)
                .post('/auth/login')
                .send({
                    email: "",
                    password: ""
                });
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Email e senha são obrigatórios');
        });

        it('Quando informo email inválido recebo 400', async () => {
            const resposta = await request(API)
                .post('/auth/login')
                .send({
                    email: "invalid@gmail.com",
                    password: "1234"
                });
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Credenciais inválidas');
        });

        it('Quando informo senha inválida recebo 400', async () => {
            const resposta = await request(API)
                .post('/auth/login')
                .send({
                    email: "string",
                    password: "wrongpassword"
                });
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Credenciais inválidas');  
        });

        it('Quando informo email e senha válidos recebo token', async () => {
            const resposta = await request(API)
                .post('/auth/login')
                .send({
                    email: "string",
                    password: "string"
                });
            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.have.property('token');
            expect(resposta.body).to.have.property('user');
            expect(resposta.body.user).to.have.property('id');
            expect(resposta.body.user.email).to.equal('string');
            // Comparação de igualdade estrita usando o ===. Verifica se os dois valores são iguais sem fazer conversão de tipo
            expect(resposta.body.user.name).to.equal('string');
            //  Verifica se os dois valores têm a mesma estrutura e se seus elementos internos (chaves, valores, etc.) são idênticos
            expect(resposta.body.user.favored).to.eql(['andre@gmail.com']);
            expect(resposta.body.user).to.have.property('balance');
        });
    });
});