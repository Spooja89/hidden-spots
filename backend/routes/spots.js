// routes/spots.js
const express = require('express');
const router = express.Router();
const Spot = require('../models/Spot');

router.get('/', async (req, res) => {
  const spots = await Spot.find();
  res.json(spots);
});

router.post('/', async (req, res) => {
  const spot = new Spot(req.body);
  await spot.save();
  res.json(spot);
});

module.exports = router;
