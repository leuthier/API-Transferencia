const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Registrar um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               favored:
 *                 type: boolean
 *               balance:
 *                 type: number
 *     responses:
 *       201:
 *         description: Usuário criado
 *       400:
 *         description: Erro de validação
 */
router.post('/', (req, res) => {
  const {name, email, password, favored = false, balance = 0} = req.body;
  
  if(!name || !email || !password){
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios'});
  }

  if(userService.userExists(email)){
    return res.status(400).json({ error: 'Email já cadastrado' });
  }

  if(typeof favored !== 'boolean'){
    return res.status(400).json({ error: 'Campo favored deve ser booleano'});  
  }

  if(typeof balance !== 'number' || balance < 0){
    return res.status(400).json({ error: 'Campo balance deve ser numérico e não pode ser negativo'});  
  }

  try{
    const user = userService.registerUser(req.body);
    res.status(201).json(user);
  } catch(err){
    res.status(err.status || 500).json({ message: err.message || 'erro interno' });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar usuários
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/', (req, res) => {
  res.json(userService.listUsers());
});

module.exports = router;
