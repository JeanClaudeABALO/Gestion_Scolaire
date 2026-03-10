import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    eleve: null,
    userType: null // 'PROF', 'ADMIN', 'PARENT'
  }),

  getters: {
    // L'utilisateur est authentifié seulement s'il a un token ET des données utilisateur valides
    isAuthenticated: (state) => {
      return !!state.token && (!!state.user || !!state.eleve)
    },
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isProfesseur: (state) => state.userType === 'PROF' || state.userType === 'ADMIN',
    isParent: (state) => state.userType === 'PARENT'
  },

  actions: {
    async loginProfesseur(code_professeur) {
      try {
        const response = await axios.post(`${API_URL}/auth/professeur`, {
          code_professeur
        })
        
        this.token = response.data.token
        this.user = response.data.user
        this.userType = response.data.user.role === 'ADMIN' ? 'ADMIN' : 'PROF'
        this.eleve = null
        
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify({ ...response.data.user, type: this.userType }))
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Erreur de connexion' 
        }
      }
    },

    async loginParent(code_secret) {
      try {
        const response = await axios.post(`${API_URL}/auth/parent`, {
          code_secret
        })
        
        this.token = response.data.token
        this.eleve = response.data.eleve
        this.user = null
        this.userType = 'PARENT'
        
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify({ ...response.data.eleve, type: 'PARENT' }))
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Erreur de connexion' 
        }
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.eleve = null
      this.userType = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
    },

    initAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        // Vérifier si on a aussi les données utilisateur en localStorage
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser)
            this.token = token
            this.user = userData
            // Déterminer le type d'utilisateur
            if (userData.type === 'PARENT') {
              this.userType = 'PARENT'
              this.eleve = userData
              this.user = null
            } else if (userData.role === 'ADMIN') {
              this.userType = 'ADMIN'
              this.eleve = null
            } else if (userData.role === 'PROF') {
              this.userType = 'PROF'
              this.eleve = null
            } else {
              // Type inconnu, nettoyer
              this.logout()
              return
            }
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          } catch (error) {
            // Si les données sont invalides, nettoyer
            console.error('Erreur parsing user data:', error)
            this.logout()
          }
        } else {
          // Pas de données utilisateur, considérer comme non authentifié
          this.logout()
        }
      }
    }
  }
})
