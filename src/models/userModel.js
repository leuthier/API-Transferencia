// Banco de dados em memória
const users = [
  {
    "id": "eb2d3111-4f9b-4bbe-88ec-89c623c49a46",
    "name": "andre",
    "email": "andre@gmail.com",
    "favored": false,
    "balance": 5000,
    "hashedPassword": "$2b$08$iYUnNHCQCKFcURxtFQH4SeOoBHNgvSBUWFBY7n6xcRMibHiNithxS"
  },
  {
    "id": "84e47cef-4783-4398-9d72-6eed9d67bf8e",
    "name": "victor",
    "email": "victor@leuth.com",
    "favored": true,
    "balance": 10000,
    "hashedPassword": "$2a$10$7QJfXG9c1r0n0mZ6p8uXUu5c8HfQOeG5bFz1Z5eFz1Z5eFz1Z5eFz1"
  },
  {
    "id": "b81a5ae0-32fc-43b0-8f33-dbe419cd6033",
    "name": "string",
    "email": "string",
    "hashedPassword": "$2b$08$kdNY2/VyTSRVd2mKMyfv5uheBB5AHOUe3CNbUPdFAd26xK3eFS0qy",
    "favored": true,
    "balance": 10
  }
]

module.exports = {
  getAll: () => users,
  findByEmail: (email) => users.find(u => u.email === email),
  findById: (id) => users.find(u => u.id === id),
  create: (user) => { users.push(user); return user; }
};
