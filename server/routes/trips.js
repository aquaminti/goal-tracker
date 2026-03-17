const express = require('express');
const Trip = require('../models/Trip');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.user.toString() !== req.userId) return res.status(403).json({ message: 'Access denied' });
    res.json(trip);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { destination, description, startDate, endDate, budget, currency, placesToVisit, status, coverColor } = req.body;
    if (!destination) return res.status(400).json({ message: 'Destination is required' });

    const trip = await Trip.create({
      user: req.userId,
      destination,
      description,
      startDate,
      endDate,
      budget: budget || 0,
      currency: currency || 'USD',
      placesToVisit: placesToVisit || [],
      status: status || 'planned',
      coverColor: coverColor || '#0ea5e9',
    });
    res.status(201).json(trip);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.user.toString() !== req.userId) return res.status(403).json({ message: 'Access denied' });

    const updated = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.user.toString() !== req.userId) return res.status(403).json({ message: 'Access denied' });

    await trip.deleteOne();
    res.json({ message: 'Trip deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
