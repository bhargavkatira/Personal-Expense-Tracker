
const express = require('express');
const Category = require('../models/category');
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

// Get Categories
router.get('/', authenticateToken, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.userId });
    res.json(categories);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add Category
router.post('/', authenticateToken, async (req, res) => {
  const { name } = req.body;
  try {
    const category = new Category({ userId: req.user.userId, name });
    await category.save();
    res.status(201).send('Category added');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Edit Category
router.put('/:id', authenticateToken, async (req, res) => {
  const { name } = req.body;
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });
    res.json(category);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete Category
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.send('Category deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
