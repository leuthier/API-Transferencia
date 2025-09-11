
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const transferService = require('../../../src/services/transferService');
const app = require('../../../app');
const { create } = require('../../../src/models/userModel');

describe('Transfer Controller - Mock - Fixture', () => {
    beforeEach(() => {
        sinon.stub(transferService, 'transfer').returns({
            transfer: {
                id: "69338a9b-8a5a-41ef-808f-aedf72ebeac5",
                from: {
                    id: "b81a5ae0-32fc-43b0-8f33-dbe419cd6033",
                    email: "string"
                },
                "to": {
                    id: "eb2d3111-4f9b-4bbe-88ec-89c623c49a46",
                    email: "andre@gmail.com"
                },
                "amount": 10,
                "createdAt": new Date().toISOString()
            }
        });
       
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('POST /transfers', () => {
        it('Quando informo valores válidos eu tenho sucesso com 201', async () => {
            // Gera token JWT válido
            const secret = process.env.JWT_SECRET || 'top-secret';

            const mockUser = { id: 'user-id', email: 'string', name: 'User Name' };
            const token = jwt.sign(mockUser, secret, { expiresIn: '1h' });

            const resposta = await request(app)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    fromEmail: 'string',
                    toEmail: 'andre@gmail.com',
                    amount: 10
                });

            expect(resposta.status).to.equal(201);
            const respostaEsperada = require('../fixture/response/quandoInformoUsuariosExistentesEvalorPositivoEuTenhoSucessoCom201.json');
            // Remover createdAt dinâmico para comparação
            delete resposta.body.transfer.createdAt;
            delete respostaEsperada.transfer.createdAt;
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

    });
    
});
