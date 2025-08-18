const userModel = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');

function registerUser({ name, email, password, favored = false, balance = 0 }){
  if(!name || !email || !password) throw {
    status: 400, message: 'nome, email e senha são obrigatórios'
  };

  const exists = userModel.findByEmail(email);
  if(exists) throw {
    status: 409, message: 'usuário já existe'
  };

  const user = {
    id: uuidv4(),
    name,
    email,
    password,
    favored: !!favored,
    balance
  };

  return userModel.create(user);

}

function listUsers(){
  return userModel.getAll().map(u => ({ id: u.id, name: u.name, email: u.email, favored: u.favored, balance: u.balance }));
}

function authenticate({ email, password }){
  if(!email || !password) throw { status: 400, message: 'email e senha são obrigatórios' };
  const user = userModel.findByEmail(email);
  if(!user || user.password !== password) throw { status: 401, message: 'credenciais inválidas' };
  // token simples para demonstração
  return { token: `token-${user.id}`, user: { id: user.id, email: user.email, name: user.name } };
}

function transfer(payload){
  return transferService.transfer(payload);
}

module.exports = { registerUser, listUsers, authenticate, transfer };
