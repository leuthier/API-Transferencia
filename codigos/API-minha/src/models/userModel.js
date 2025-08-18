// Banco de dados em memória
const users = [
  {
    "email": "victor@leuthier.com"
  },
  {
    "id": "eb2d3111-4f9b-4bbe-88ec-89c623c49a46",
    "name": "andre",
    "email": "andre@gmail.com",
    "favored": false,
    "balance": 10
  },
  {
    "id": "84e47cef-4783-4398-9d72-6eed9d67bf8e",
    "name": "victor2",
    "email": "victor@leuth.com",
    "favored": true,
    "balance": 100
  }
]

module.exports = {
  getAll: () => users,
  findByEmail: (email) => users.find(u => u.email === email),
  findById: (id) => users.find(u => u.id === id),
  create: (user) => { users.push(user); return user; },
  clear: () => { users.length = 0; }
};
