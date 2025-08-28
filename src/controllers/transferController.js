const express = require('express');
const router = express.Router();
const transferService = require('../services/transferService');
const authenticateToken = require('../middleware/authenticateToken');


router.post('/', authenticateToken, (req, res) => {
  const {fromEmail, toEmail, amount} = req.body;
  if(!fromEmail || !toEmail) {
    return res.status(400).json({ error: 'Usuário remetente ou destinatário não foram encontrados'});
  }
  if (fromEmail !== req.user.email) {
    return res.status(403).json({ error: 'Você só pode transferir valores da sua própria conta' });
  }
  if (fromEmail === toEmail) {
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
