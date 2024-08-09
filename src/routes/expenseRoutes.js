const express = require('express');
const Expense = require('../models/expense');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Add Expense
router.post('/', authenticateToken, async (req, res) => {
  const { date, amount, category, description } = req.body;
  try {
    const expense = new Expense({ userId: req.user.userId, date, amount, category, description });
    await expense.save();
    res.status(201).send('Expense added');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get Expenses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId });
    res.json(expenses);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Edit Expense
router.put('/:id', authenticateToken, async (req, res) => {
  const { date, amount, category, description } = req.body;
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, { date, amount, category, description }, { new: true });
    res.json(expense);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete Expense
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.send('Expense deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;