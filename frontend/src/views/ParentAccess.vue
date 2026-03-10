<template>
  <div class="parent-access-page">
    <header class="access-header">
      <div class="header-content">
        <div class="logo">
          <Icon name="book" :size="28" class="logo-icon-inline" />
          <h1>Système de Gestion Scolaire</h1>
        </div>
        <button @click="goToHome" class="btn-home">
          <Icon name="arrow-left" :size="18" class="home-icon" />
          Retour à l'accueil
        </button>
      </div>
    </header>

    <div class="access-container">
      <div class="access-card">
        <div class="logo-section">
          <Icon name="family" :size="64" class="logo-icon" />
          <h2>Accès Espace Parent</h2>
          <p class="subtitle">Entrez le code secret de votre enfant pour accéder à son espace</p>
        </div>
        
        <form @submit.prevent="handleAccess" class="access-form">
          <div class="form-group">
            <label for="code-secret">Code secret de l'élève</label>
            <input
              v-model="codeSecret"
              type="text"
              id="code-secret"
              placeholder="Entrez le code secret"
              required
              autofocus
              class="code-input"
              :disabled="loading"
            />
            <small class="form-hint">Ce code vous a été communiqué lors de l'inscription de votre enfant</small>
          </div>
          
          <div v-if="error" class="error-message">
            <Icon name="warning" :size="18" class="error-icon" />
            {{ error }}
          </div>

          <button type="submit" class="btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Accéder à l'espace</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import Icon from '../components/Icons.vue'

export default {
  name: 'ParentAccess',
  components: {
    Icon
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const codeSecret = ref('')
    const error = ref('')
    const loading = ref(false)

    const handleAccess = async () => {
      error.value = ''
      
      if (!codeSecret.value.trim()) {
        error.value = 'Veuillez entrer le code secret'
        return
      }

      loading.value = true

      try {
        const result = await authStore.loginParent(codeSecret.value.trim())

        if (result.success) {
          // Redirection vers l'espace parent
          router.push('/parent')
        } else {
          error.value = result.message || 'Code secret invalide. Vérifiez votre code et réessayez.'
        }
      } catch (err) {
        error.value = 'Erreur de connexion. Veuillez réessayer.'
        console.error('Erreur accès parent:', err)
      } finally {
        loading.value = false
      }
    }

    const goToHome = () => {
      router.push('/')
    }

    return {
      codeSecret,
      error,
      loading,
      handleAccess,
      goToHome
    }
  }
}
</script>

<style scoped>
.parent-access-page {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.access-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 15px 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon-inline {
  color: #3498db;
}

.logo h1 {
  font-size: 20px;
  color: #333;
  margin: 0;
}

.btn-home {
  background: none;
  border: none;
  color: #3498db;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.btn-home:hover {
  background-color: #f0f2f5;
}

.access-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.access-card {
  background: white;
  padding: 50px 40px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
  width: 100%;
  max-width: 450px;
}

.logo-section {
  margin-bottom: 35px;
}

.logo-section .logo-icon {
  color: #3498db;
  margin-bottom: 20px;
}

.access-card h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
}

.access-card .subtitle {
  color: #777;
  font-size: 16px;
  line-height: 1.5;
}

.access-form {
  margin-top: 35px;
}

.form-group {
  margin-bottom: 25px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  color: #555;
  font-weight: 600;
  font-size: 15px;
}

.code-input {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.code-input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  outline: none;
}

.code-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.code-input::placeholder {
  color: #bbb;
}

.form-hint {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  color: #999;
  line-height: 1.4;
}

.error-message {
  background-color: #fef2f2;
  color: #ef4444;
  padding: 12px 18px;
  border-radius: 10px;
  margin-bottom: 25px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  border: 1px solid #fecaca;
}

.error-icon {
  color: #ef4444;
  flex-shrink: 0;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  background: #aab7e0;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid #fff;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .access-card {
    padding: 35px 25px;
  }

  .access-card h2 {
    font-size: 24px;
  }
}
</style>
