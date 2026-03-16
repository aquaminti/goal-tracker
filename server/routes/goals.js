const express = require('express');
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, deadline, progress, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const goal = await Goal.create({
      user: req.userId,
      title,
      description,
      deadline,
      progress: progress || 0,
      status: status || 'active',
    });

    res.status(201).json(goal);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updated = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await goal.deleteOne();
    res.json({ message: 'Goal deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
