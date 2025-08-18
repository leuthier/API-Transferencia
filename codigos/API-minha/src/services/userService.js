const userModel = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');

function registerUser({ name, email, password, favored = false, balance = 0 }){
  if(!name || !email || !password) throw { status: 400, message: 'nome, email e senha são obrigatórios' };
  const exists = userModel.findByEmail(email);
  if(exists) throw { status: 409, message: 'usuário já existe' };
  const user = { id: uuidv4(), name, email, password, favored: !!favored, balance };
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

function transfer({ fromId, toId, amount }){
  const from = userModel.findById(fromId);
  const to = userModel.findById(toId);
  if(!from) throw { status: 404, message: 'remetente não encontrado' };
  if(!to) throw { status: 404, message: 'destinatário não encontrado' };
  if(amount <= 0) throw { status: 400, message: 'o valor deve ser maior que zero' };
  // regra: transferências para destinatários não favorecidos somente se amount < 5000
  if(!to.favored && amount >= 5000) throw { status: 400, message: 'transferências para destinatários não favorecidos devem ser menores que R$ 5.000,00' };
  if(from.balance < amount) throw { status: 400, message: 'fundos insuficientes' };
  from.balance -= amount;
  to.balance += amount;
  return { from: { id: from.id, balance: from.balance }, to: { id: to.id, balance: to.balance } };
}

module.exports = { registerUser, listUsers, authenticate, transfer };
