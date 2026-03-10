<template>
  <div class="login-page">
    <!-- Header léger -->
    <header class="login-header">
      <div class="header-content">
        <button @click="goToHome" class="btn-home">
          <Icon name="arrow-left" :size="18" class="home-icon" />
          Retour à l'accueil
        </button>
        <div class="header-logo">
          <Icon name="book" :size="24" class="logo-icon" />
          <span class="logo-text">Gestion Scolaire</span>
        </div>
      </div>
    </header>

    <!-- Fond avec image + carte centrée -->
    <div class="login-bg">
      <div class="login-wrapper">
        <div class="login-card">
          <!-- Panneau gauche : illustration / branding bleu ciel -->
          <div class="login-card-left">
            <div class="left-content">
              <Icon name="book" :size="72" class="left-icon" />
              <h2 class="left-title">Gestion Scolaire</h2>
              <p class="left-subtitle">Système de gestion des notes. Centralisez les évaluations, suivez la progression des élèves et facilitez la communication avec les familles.</p>
            </div>
          </div>

          <!-- Panneau droit : formulaire -->
          <div class="login-card-right">
            <div class="welcome-banner">Bienvenue</div>
            <h3 class="form-title">Connectez-vous à votre compte</h3>

            <form @submit.prevent="handleLogin" class="login-form">
              <div class="form-group">
                <label>Code d'accès</label>
                <input
                  v-model="code"
                  type="text"
                  placeholder="Entrez votre code d'accès"
                  required
                  autofocus
                  class="code-input"
                  :disabled="loading"
                />
                <small class="form-hint">Code professeur ou code secret élève</small>
              </div>

              <div v-if="error" class="error-message">
                <Icon name="warning" :size="18" class="error-icon" />
                {{ error }}
              </div>

              <button type="submit" class="btn-login" :disabled="loading">
                <span v-if="loading" class="spinner"></span>
                <span v-else>Se connecter</span>
              </button>
            </form>

            <router-link to="/inscription" class="btn-create-account">
              Créer un compte professeur
            </router-link>
          </div>
        </div>
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
  name: 'Login',
  components: { Icon },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const code = ref('')
    const error = ref('')
    const loading = ref(false)

    const handleLogin = async () => {
      error.value = ''
      if (!code.value.trim()) {
        error.value = 'Veuillez entrer un code'
        return
      }
      loading.value = true
      try {
        let result = await authStore.loginProfesseur(code.value.trim())
        if (!result.success) result = await authStore.loginParent(code.value.trim())

        if (result.success) {
          if (authStore.userType === 'PARENT') router.push('/parent')
          else if (authStore.userType === 'ADMIN' || (authStore.user && authStore.user.role === 'ADMIN')) router.push('/responsable')
          else router.push('/professeur')
        } else {
          error.value = result.message || 'Code invalide. Vérifiez votre code et réessayez.'
        }
      } catch (err) {
        error.value = 'Erreur de connexion. Veuillez réessayer.'
        console.error('Erreur login:', err)
      } finally {
        loading.value = false
      }
    }

    const goToHome = () => router.push('/')

    return { code, error, loading, handleLogin, goToHome }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header bleu ciel, largeur augmentée */
.login-header {
  background: linear-gradient(135deg, #5dade2 0%, #3498db 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 14px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-home {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: white;
  transition: all 0.25s;
}

.btn-home:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.logo-icon { font-size: 24px; color: white; }

.logo-text {
  color: white;
}

/* Fond avec image */
.login-bg {
  flex: 1;
  min-height: calc(100vh - 56px);
  background-color: #87ceeb;
  background-image: url('/hero-bg.jpg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-wrapper {
  width: 100%;
  max-width: 920px;
}

/* Carte à deux colonnes, bords très arrondis */
.login-card {
  display: flex;
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  min-height: 480px;
}

/* Panneau gauche bleu ciel */
.login-card-left {
  width: 42%;
  min-width: 280px;
  background: linear-gradient(160deg, #5dade2 0%, #3498db 100%);
  padding: 48px 40px;
  display: flex;
  align-items: center;
}

.left-content {
  color: white;
  text-align: center;
}

.left-icon {
  opacity: 0.95;
  margin-bottom: 24px;
}

.left-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: white;
}

.left-subtitle {
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.92;
  margin: 0;
}

/* Panneau droit formulaire */
.login-card-right {
  flex: 1;
  padding: 40px 48px 32px;
  display: flex;
  flex-direction: column;
}

.welcome-banner {
  background: linear-gradient(135deg, #7ec8e3 0%, #5dade2 100%);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 10px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  align-self: flex-start;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 28px 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #34495e;
  font-size: 14px;
}

.code-input {
  padding: 14px 0 10px;
  border: none;
  border-bottom: 2px solid #e0e0e0;
  font-size: 16px;
  background: transparent;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.code-input:focus {
  outline: none;
  border-bottom-color: #5dade2;
  box-shadow: 0 2px 0 0 #5dade2;
}

.code-input::placeholder {
  color: #bdc3c7;
}

.code-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-hint {
  color: #95a5a6;
  font-size: 12px;
  margin-top: 2px;
}

.btn-login {
  padding: 14px 24px;
  background: linear-gradient(135deg, #5dade2 0%, #3498db 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 8px;
  box-shadow: 0 4px 14px rgba(52, 152, 219, 0.4);
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.45);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  vertical-align: middle;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  padding: 12px 16px;
  background: #fde8e8;
  color: #c0392b;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
}

.btn-create-account {
  margin-top: auto;
  padding-top: 24px;
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  text-decoration: underline;
  text-align: left;
  transition: color 0.2s;
}

.btn-create-account:hover {
  color: #2980b9;
}

/* Responsive : une colonne sur petit écran */
@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
    min-height: auto;
  }

  .login-card-left {
    width: 100%;
    min-width: 0;
    padding: 32px 24px;
  }

  .left-icon { font-size: 56px; }
  .left-title { font-size: 1.5rem; }
  .left-subtitle { font-size: 0.9rem; }

  .login-card-right {
    padding: 32px 24px;
  }

  .login-bg {
    background-image: url('/hero-bg.jpg.jpg');
  }
}
</style>
