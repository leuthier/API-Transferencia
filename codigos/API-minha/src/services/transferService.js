const userModel = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');
const transferModel = require('../models/transferModel');

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
  const transfer = { id: uuidv4(), fromId: from.id, toId: to.id, amount, createdAt: new Date().toISOString() };
  transferModel.create(transfer);
  return { from: { id: from.id, balance: from.balance }, to: { id: to.id, balance: to.balance }, transfer };
}

function listTransfers(){
  return transferModel.getAll();
}

function getTransferById(id){
  return transferModel.findById(id);
}

function getTransfersByUserId(userId){
  return transferModel.findByUserId(userId);
}

module.exports = { transfer, listTransfers, getTransferById, getTransfersByUserId };
