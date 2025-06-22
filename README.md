# hidden-spots

# 🌍 Hidden Spots – Location-Based Community Platform

Hidden Spots is a community-driven mobile app built with React Native that allows users to discover and share meaningful hidden locations in **Gwalior, Madhya Pradesh**. Whether it's a romantic rooftop, a peaceful lake, or a creative street corner, every spot has a story!

---

## 📱 Features

### Frontend (React Native with Expo)
- 🗺️ **Map-based Spot Discovery** (Google Maps)
- 🔍 **Search & Filter** by category (Romantic, Serene, Creative)
- 💬 **Community Spot Details** (Story, Ratings, Comments)
- ➕ **Add New Spot** with location, image, and story
- 📸 **Upload Images** via Cloudinary
- ⭐ **Rate Vibe, Safety, Crowd, Uniqueness**
- 🧠 **Smart Feed Buttons** (e.g., "Nearby Romantic Spots")

### Backend (Node.js + Express)
- 🌐 REST API for spots
- 📍 MongoDB Geospatial indexing
- 📷 Cloudinary image upload integration
- 💬 Ratings and comment system
- 🌱 Seeder script for 4+ hidden spots in Gwalior

---

## 🚀 Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Frontend    | React Native + Expo           |
| Maps        | react-native-maps (Google Maps)|
| Backend     | Node.js, Express.js           |
| Database    | MongoDB Atlas (Geospatial)    |
| Image Upload| Cloudinary                    |
| Location    | expo-location                 |
| File Upload | expo-image-picker             |

---

## 🛠️ Installation & Running

### 🔧 Backend Setup

bash..
cd backend
npm install
npx nodemon server.js
# Create .env with:
# MONGO_URI = your_mongodb_atlas_connection_string

# Seed Gwalior data:
node scripts/seed.js

# Start server
node server.js

cd frontend
npm install
npx expo start
     or
npx expo start --clear



