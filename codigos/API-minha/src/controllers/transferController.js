const express = require('express');
const router = express.Router();
const transferService = require('../services/transferService');

/**
 * @swagger
 * /transfers:
 *   post:
 *     summary: Realizar transferência entre usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromId:
 *                 type: string
 *               toId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transferência realizada
 */
router.post('/', (req, res) => {
  try{
    const result = transferService.transfer(req.body);
    res.json(result);
  } catch(err){
    res.status(err.status || 500).json({
      message: err.message || 'erro interno'
    });
  }
});

/**
 * @swagger
 * /transfers:
 *   get:
 *     summary: Listar transferências
 *     responses:
 *       200:
 *         description: Listar transferências
 */
router.get('/', (req, res) => {
  res.json(transferService.listTransfers());
});

module.exports = router;
