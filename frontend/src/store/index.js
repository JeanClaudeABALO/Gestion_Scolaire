import { createStore } from 'vuex'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

axios.defaults.baseURL = API_URL

const store = createStore({
  state: {
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    loading: false
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || null,
    userType: (state) => state.user?.type || null,
    currentUser: (state) => state.user
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    SET_USER(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    CLEAR_AUTH(state) {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },
  actions: {
    async login({ commit }, { code, type }) {
      try {
        const endpoint = type === 'parent' ? '/auth/parent' : '/auth/professeur'
        const field = type === 'parent' ? 'code_secret' : 'code_professeur'
        
        const response = await axios.post(endpoint, { [field]: code })
        
        commit('SET_TOKEN', response.data.token)
        commit('SET_USER', response.data.user)
        
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Erreur de connexion' 
        }
      }
    },
    logout({ commit }) {
      commit('CLEAR_AUTH')
    },
    initAuth({ commit }) {
      const token = localStorage.getItem('token')
      if (token) {
        commit('SET_TOKEN', token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
    }
  }
})

// Initialiser l'authentification au démarrage
store.dispatch('initAuth')

export default store
