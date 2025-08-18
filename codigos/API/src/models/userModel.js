// Banco de dados em memória
const users = [];

module.exports = {
  getAll: () => users,
  findByEmail: (email) => users.find(u => u.email === email),
  findById: (id) => users.find(u => u.id === id),
  create: (user) => { users.push(user); return user; },
  clear: () => { users.length = 0; }
};
