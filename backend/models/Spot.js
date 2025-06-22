// models/Spot.js
const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  story: String,
  coordinates: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
  },
  ratings: {
    vibe: Number,
    safety: Number,
    uniqueness: Number,
    crowd: Number,
  },
  images: [String],
  comments: [
    {
      text: String,
      user: String, // "anonymous" or username
    }
  ]
});

spotSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Spot', spotSchema);
