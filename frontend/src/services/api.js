import axios from 'axios'

// En production (Docker, build), utiliser la variable d'environnement
const API_URL = import.meta.env.VITE_API_URL || 'https://gestion-scolaire.onrender.com/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000 // 60 secondes pour les uploads
})

// Intercepteur pour ajouter le token et les headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('API Request:', config.method?.toUpperCase(), config.url, 'Token:', token.substring(0, 20) + '...')
    } else {
      console.warn('API Request sans token:', config.method?.toUpperCase(), config.url)
    }
    // Ne pas définir Content-Type pour multipart/form-data, le navigateur le fera automatiquement
    if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.method?.toUpperCase(), response.config.url, 'Status:', response.status)
    return response
  },
  (error) => {
    console.error('API Error:', {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    })
    
    if (error.response?.status === 401) {
      const path = window.location.pathname
      const pagePublique = path === '/' || path === '/login' || path === '/inscription' || path === '/parent-access'
      if (!pagePublique) {
        console.error('Non autorisé - redirection vers login')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
