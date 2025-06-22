const express = require('express');
const router = express.Router();
const Spot = require('../models/Spot');

// ---------------------
// GET all spots
// ---------------------
router.get('/', async (req, res) => {
  try {
    const spots = await Spot.find();
    res.json(spots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------
// POST a new spot
// ---------------------
router.post('/', async (req, res) => {
  try {
    const newSpot = new Spot(req.body);
    const saved = await newSpot.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------------------
// POST /api/spots/:id/rate
// ---------------------
router.post('/:id/rate', async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id);
    if (!spot) return res.status(404).json({ message: 'Spot not found' });

    const { vibe, safety, uniqueness, crowd } = req.body;

    // Average each rating
    spot.ratings.vibe = (spot.ratings.vibe + vibe) / 2;
    spot.ratings.safety = (spot.ratings.safety + safety) / 2;
    spot.ratings.uniqueness = (spot.ratings.uniqueness + uniqueness) / 2;
    spot.ratings.crowd = (spot.ratings.crowd + crowd) / 2;

    await spot.save();
    res.json({ message: '✅ Rating updated successfully', ratings: spot.ratings });
  } catch (err) {
    console.error('❌ Rating update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
