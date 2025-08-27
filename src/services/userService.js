const jwt = require('jsonwebtoken');
const users = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

function userExists(email) {
  return !!users.findByEmail(email);
}

function registerUser({ name, email, password, favored = false, balance = 0 }){
  if(!name || !email || !password) throw new Error ('Nome, email e senha são obrigatórios');

  const exists = userExists(email);
  if(exists) throw new Error('Usuário já existe');

  const hashedPassword = bcrypt.hashSync(password, 8);

  const user = {
    id: uuidv4(),
    name,
    email,
    hashedPassword,
    favored: !!favored,
    balance
  };

  return users.create(user);

}

function listUsers(){
  return users.getAll().map(u => ({ 
    id: u.id,
    name: u.name,
    email: u.email,
    password: u.hashedPassword,
    favored: u.favored,
    balance: u.balance
  }));
}

function authenticate({ email, password }){
  const user = users.findByEmail(email);
  if(!user || !bcrypt.compareSync(password, user.hashedPassword)) {
    const err = new Error('Credenciais inválidas');
    err.status = 400;
    throw err;
  }

  // Gerar JWT
  const secret = process.env.JWT_SECRET || 'top-secret';
  const token = jwt.sign(
    { id: user.id,
      name: user.name,
      email: user.email,
      favored: user.favored,
      balance: user.balance
    },
    secret,
    { expiresIn: '1h' }
  );

  return { token,
          user: { 
            id: user.id,
            email: user.email,
            name: user.name,
            favored: user.favored,
            balance: user.balance
            }
         };
}

function transfer(payload){
  return transferService.transfer(payload);
}

module.exports = {
  registerUser,
  listUsers,
  authenticate,
  transfer,
  userExists
};
