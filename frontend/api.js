// frontend/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.1.40:5000/api', // ✅ Use your laptop's IP, not localhost
});

export default API;
