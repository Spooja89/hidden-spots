require('dotenv').config();
const mongoose = require('mongoose');
const Spot = require('../models/Spot');

const MONGO_URI = process.env.MONGO_URI; // ✅ uses .env

const seedData = [
  {
    name: 'Sunset Point',
    category: 'romantic',
    description: 'Best place to watch the sunset with your loved one.',
    story: 'We watched the sky change colors...',
    coordinates: { type: 'Point', coordinates: [78.1734, 26.2183] },
    ratings: { vibe: 4, safety: 5, uniqueness: 3, crowd: 2 },
    images: [], comments: [],
  },
  {
    name: 'Tansen Tomb',
    category: 'serene',
    description: 'Historical calm area with greenery.',
    story: 'It was so peaceful here.',
    coordinates: { type: 'Point', coordinates: [78.1780, 26.2189] },
    ratings: { vibe: 4, safety: 4, uniqueness: 5, crowd: 3 },
    images: [], comments: [],
  },
  {
    name: 'Jai Vilas Palace',
    category: 'creative',
    description: 'Architectural beauty and museum inside.',
    story: 'A hidden gem for art lovers.',
    coordinates: { type: 'Point', coordinates: [78.1769, 26.2155] },
    ratings: { vibe: 3, safety: 4, uniqueness: 4, crowd: 3 },
    images: [], comments: [],
  },
  {
    name: 'Sahastra Bahu Temple',
    category: 'romantic',
    description: 'Ancient temple near fort with views.',
    story: 'Magical moment during golden hour.',
    coordinates: { type: 'Point', coordinates: [78.1665, 26.2211] },
    ratings: { vibe: 5, safety: 4, uniqueness: 4, crowd: 2 },
    images: [], comments: [],
  }
];


mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!');
    return Spot.deleteMany({});
  })
  .then(() => Spot.insertMany(seedData))
  .then(() => {
    console.log('🌱 Seed data inserted!');
    process.exit();
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
