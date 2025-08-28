// Banco de dados em memória para transfers
const transfers = [
  {
    "id": "4c9b65ff-1ba8-421b-864c-8e2658a2bed7",
    "from": {
      "id": "b81a5ae0-32fc-43b0-8f33-dbe419cd6033",
      "email": "string"
    },
    "to": {
      "id": "eb2d3111-4f9b-4bbe-88ec-89c623c49a46",
      "email": "andre@gmail.com"
    },
    "amount": 10,
    "createdAt": "2025-08-28T05:42:10.733Z"
  },
  {
    "id": "d4ed1f83-4f09-4fc5-8dbd-774d1b93f090",
    "from": {
      "id": "84e47cef-4783-4398-9d72-6eed9d67bf8e",
      "email": "victor@leuth.com"
    },
    "to": {
      "id": "eb2d3111-4f9b-4bbe-88ec-89c623c49a46",
      "email": "andre@gmail.com"
    },
    "amount": 1000,
    "createdAt": "2025-08-27T12:02:19.235Z"
  }
];

module.exports = {
  getAll: () => transfers,
  findById: (id) => transfers.find(t => t.id === id),
  // retorna transferências onde o usuário é remetente ou destinatário
  findByUserId: (userId) => transfers.filter(t => t.fromId === userId || t.toId === userId),
  create: (transfer) => { transfers.push(transfer); return transfer; },
};
