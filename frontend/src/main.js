import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './store/auth'

// Vérifier que le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}

function initApp() {
  try {
    const app = createApp(App)
    const pinia = createPinia()

    app.use(pinia)
    app.use(router)

    // Gestionnaire d'erreur global
    app.config.errorHandler = (err, instance, info) => {
      console.error('Erreur Vue.js:', err, info)
      console.error('Instance:', instance)
    }

    // Initialiser l'authentification au démarrage
    const authStore = useAuthStore()
    authStore.initAuth()

    app.mount('#app')
    
    console.log('✅ Application Vue.js chargée avec succès')
  } catch (error) {
    console.error('❌ Erreur lors du chargement de l\'application:', error)
    document.getElementById('app').innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
        <div style="text-align: center; color: red;">
          <h2>Erreur de chargement</h2>
          <p>${error.message}</p>
          <p>Vérifiez la console pour plus de détails (F12)</p>
        </div>
      </div>
    `
  }
}
