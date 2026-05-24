const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/authMiddleware');

// Get all transactions for a user
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { title, amount, type, category, note, date } = req.body;

    const newTransaction = new Transaction({
      user: req.user.id,
      title,
      amount,
      type,
      category,
      note,
      date: date ? new Date(date) : Date.now()
    });

    const transaction = await newTransaction.save();
    res.json(transaction);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
