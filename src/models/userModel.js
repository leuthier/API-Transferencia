// Banco de dados em memória
const users = [
  {
    "id": "eb2d3111-4f9b-4bbe-88ec-89c623c49a46",
    "name": "andre",
    "email": "andre@gmail.com",
    "favored": [
      "victor@leuth.com",
    ],
    "balance": 5000000,
    "hashedPassword": "$2b$08$iYUnNHCQCKFcURxtFQH4SeOoBHNgvSBUWFBY7n6xcRMibHiNithxS"
  },
  {
  "id": "8536109d-5824-41b9-97b6-3c0f381d6f80",
  "name": "victor",
  "email": "victor@leuth.com",
  "hashedPassword": "$2b$08$KjUZYaWtDQ2XCKSYQBU8suYP.ltnOjcYex5X8MtP2WiGbhDfecy8K",
  "favored": [
    "andre@gmail.com",
    "string"
  ],
  "balance": 1234567890
  },
  {
    "id": "b81a5ae0-32fc-43b0-8f33-dbe419cd6033",
    "name": "string",
    "email": "string",
    "hashedPassword": "$2b$08$kdNY2/VyTSRVd2mKMyfv5uheBB5AHOUe3CNbUPdFAd26xK3eFS0qy",
    "favored": [
      "andre@gmail.com"
    ],
    "balance": 1000
  },
  {
  "id": "7c320a7c-10ea-456d-b8ab-4b95fee51602",
  "name": "string32",
  "email": "string32",
  "hashedPassword": "$2b$08$RfsC.vBHjqjYr2KnlU/ZFuvrZpEtZ/9K59dYo90V83IGo8zhxv4We",
  "favored": [
    "victor@leuth.com"
  ],
  "balance": 987654321
}
]

module.exports = {
  getAll: () => users,
  findByEmail: (email) => users.find(u => u.email === email),
  findById: (id) => users.find(u => u.id === id),
  create: (user) => { users.push(user); return user; }
};
