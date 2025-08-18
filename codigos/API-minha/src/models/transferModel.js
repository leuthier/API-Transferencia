// Banco de dados em memória para transfers
const transfers = [];

module.exports = {
  getAll: () => transfers,
  findById: (id) => transfers.find(t => t.id === id),
  // retorna transferências onde o usuário é remetente ou destinatário
  findByUserId: (userId) => transfers.filter(t => t.fromId === userId || t.toId === userId),
  create: (transfer) => { transfers.push(transfer); return transfer; },
  clear: () => { transfers.length = 0; }
};
