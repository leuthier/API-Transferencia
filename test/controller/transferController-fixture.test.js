// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

// Aplicação
const app = require('../../app');

// Mock
const transferService = require('../../src/services/transferService');
const e = require('express');

// Testes
describe('Transfer Controller - Mock', () => {
    afterEach(() => {
        sinon.restore();
    });
    
    describe('POST /transfers', () => {
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

            // Validação com fixture
            const respostaEsperada = require('../fixture/response/quandoInformoUsuariosExistentesEvalorPositivoEuTenhoSucessoCom201');
            
            // Manipulação para editar campos
            //respostaEsperada.transfer.createdAt = respostaEsperada.transfer.createdAt.split('T')[0];

            // Usar deep equal para comparar objetos - Date = objeto dinamico, então seria diferente e por isso é necessário remover o campo
            delete resposta.body.transfer.createdAt;
            delete respostaEsperada.transfer.createdAt;
            
            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.deep.equal(respostaEsperada);

            // Mesma comparação
            //expect(resposta.body).to.eql(respostaEsperada);

            //expect(resposta.body).to.have.property('from');
            //expect(resposta.body.from).to.have.property('id', 'victor');
            //expect(resposta.body.to).to.have.property('id', 'leut');
            //expect(resposta.body).to.have.property('transfer');
            //expect(resposta.body.transfer).to.have.property('id', 'fake-transfer-id');
            //expect(resposta.body.transfer).to.have.property('amount', 100);
        });
    });
});
