const userModel = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');
const transferModel = require('../models/transferModel');

function transfer({ fromId, toId, amount }){
  const from = userModel.findById(fromId);
  const to = userModel.findById(toId);

  if(!from || !to) throw new Error('Usuário remetente ou destinatário não encontrado');
  
  if(amount <= 0) throw new Error("Valor deve ser maior que zero");

  if(from.id === to.id) throw new Error("Não é possível transferir para si mesmo");
  
  // regra: transferências para destinatários não favorecidos somente se amount < 5000
  if(!to.favored && amount >= 5000) throw new Error("Transferência acima de R$ 5.000,00 só para favorecidos");

  if(from.balance < amount) throw new Error("Saldo insuficiente");

  from.balance -= amount;
  to.balance += amount;

  const transfer = {
    id: uuidv4(),
    fromId: from.id,
    toId: to.id,
    amount,
    createdAt: new Date().toISOString()
  };

  transferModel.create(transfer);

  return {
    from: { 
        id: from.id,
        balance: from.balance
    },
    to: {
        id: to.id,
        balance: to.balance
    },
    transfer };
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

module.exports = {
    transfer,
    listTransfers,
    getTransferById,
    getTransfersByUserId
};
