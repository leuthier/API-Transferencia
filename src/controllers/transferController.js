/**
 * @swagger
 * /transfers:
 *   get:
 *     summary: Listar transferências
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de transferências
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   fromId: { type: string }
 *                   toId: { type: string }
 *                   amount: { type: number }
 *                   createdAt: { type: string, format: date-time }
 */
/**
 * @swagger
 * /transfers:
 *   post:
 *     summary: Realizar transferência entre usuários
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromId:
 *                 type: string
 *                 example: "user1"
 *               toId:
 *                 type: string
 *                 example: "user2"
 *               amount:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Transferência realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     balance: { type: number }
 *                 to:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     balance: { type: number }
 *                 transfer:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     fromId: { type: string }
 *                     toId: { type: string }
 *                     amount: { type: number }
 *                     createdAt: { type: string, format: date-time }
 *       400:
 *         description: Erro de validação ou negócio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
const express = require('express');
const router = express.Router();
const transferService = require('../services/transferService');
const authenticateToken = require('../middleware/authenticateToken');


router.post('/', authenticateToken, (req, res) => {
  const {fromId, toId, amount} = req.body;
  if(!fromId || !toId) {
    return res.status(400).json({ error: 'Usuário remetente ou destinatário não foram encontrados'});
  }
  if (fromId === toId) {
    return res.status(400).json({ error: 'Não é possível transferir para si mesmo'});
  }
  if (typeof amount !== 'number') {
    return res.status(400).json({ error: 'O valor deve ser numérico'});
  }
  if (amount <= 0) {
    return res.status(400).json({ error: 'O valor deve ser maior que zero'});
  }
  try{
    const transfer = transferService.transfer(req.body);
    res.status(201).json(transfer);
  } catch(err){
    res.status(400).json({error: err.message});
  }
});

router.get('/', authenticateToken, (req, res) => {
  res.json(transferService.listTransfers());
});

module.exports = router;
