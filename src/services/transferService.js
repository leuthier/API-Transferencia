const userModel = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');
const transferModel = require('../models/transferModel');

function transfer({ fromEmail, toEmail, amount }){
  const fromUser = userModel.findByEmail(fromEmail);
  const toUser = userModel.findByEmail(toEmail);

  if(!fromUser || !toUser) throw new Error('Usuário remetente ou destinatário não encontrado');
  
  if(amount <= 0) throw new Error("Valor deve ser maior que zero");

  if(fromUser === toUser) throw new Error("Não é possível transferir para si mesmo");
  
  // regra: transferências para destinatários não favorecidos somente se amount < 5000
  if(!toUser.favored && amount >= 5000) throw new Error("Transferência acima de R$ 5.000,00 só para favorecidos");

  if(fromUser.balance < amount) throw new Error("Saldo insuficiente");

  fromUser.balance -= amount;
  toUser.balance += amount;

  const transfer = {
    id: uuidv4(),
    from: {
      id: fromUser.id,
      email: fromUser.email,
    },
    to: {
      id: toUser.id,  
      email: toUser.email,
    },
    amount,
    createdAt: new Date().toISOString()
  };

  transferModel.create(transfer);

  return {
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
