// Banco de dados em memória para transfers
const transfers = [
    {
        "from": {
            "id": "eb2d3111-4f9b-4bbe-88ec-89c623c49a46",
            "balance": 9
        },
        "to": {
            "id": "84e47cef-4783-4398-9d72-6eed9d67bf8e",
            "balance": 101
        },
        "transfer": {
            "id": "d4ed1f83-4f09-4fc5-8dbd-774d1b93f090",
            "fromId": "eb2d3111-4f9b-4bbe-88ec-89c623c49a46",
            "toId": "84e47cef-4783-4398-9d72-6eed9d67bf8e",
            "amount": 1,
            "createdAt": "2025-08-18T05:24:05.571Z"
        }
    }
];

module.exports = {
  getAll: () => transfers,
  findById: (id) => transfers.find(t => t.id === id),
  // retorna transferências onde o usuário é remetente ou destinatário
  findByUserId: (userId) => transfers.filter(t => t.fromId === userId || t.toId === userId),
  create: (transfer) => { transfers.push(transfer); return transfer; },
  clear: () => { transfers.length = 0; }
};
