const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const userService = require('../../src/services/userService');

const app = require('../../app');
const e = require('express');

describe('User Controller - Mock', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('GET /users', () => {
        it('Deve retornar lista de usuários', async () => {
            const mockUsers = [
                { id: 'u1', name: 'Alice', email: 'alice@email.com', favored: true, balance: 1000 },
                { id: 'u2', name: 'Bob', email: 'bob@email.com', favored: false, balance: 500 }
            ];
            sinon.stub(userService, 'listUsers').returns(mockUsers);
            const resposta = await request(app).get('/users');
            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.be.an('array').with.lengthOf(2);
            expect(resposta.body[0]).to.have.property('name', 'Alice');
            expect(resposta.body[1]).to.have.property('name', 'Bob');
        });
    });

    describe('POST /users', () => {
        it('Quando informo email já cadastrado recebo 400', async () => {
            //sinon.stub(userService, 'registerUser').throws(new Error('Usuário já existe'));
            sinon.stub(userService, 'userExists').returns(true);
            const resposta = await request(app)
                .post('/users')
                .send({
                    "name": "string",
                    "email": "string",
                    "password": "string",
                    "favored": true,
                    "balance": 0
                });
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Usuário já existe');    
        });
    });   
});