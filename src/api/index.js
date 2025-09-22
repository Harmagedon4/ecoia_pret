//src/api/index.js
import axios from 'axios';

const API_URL = 'https://ecoia-pret-backend.vercel.app/api';

// Créer une instance Axios
const api = axios.create({
  baseURL: API_URL,
});

// Ajouter le token JWT automatiquement aux requêtes
api.interceptors.request.use(config => {
  const auth = localStorage.getItem('ecoia-auth');
  if (auth) {
    const user = JSON.parse(auth);
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
