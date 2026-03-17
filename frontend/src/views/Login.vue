<template>
  <div class="auth-page">
    <header class="auth-header">
      <div class="auth-header-inner">
        <button type="button" class="auth-back" @click="goToHome">
          <Icon name="arrow-left" :size="18" />
          Retour à l'accueil
        </button>
        <div class="auth-brand">
          <Icon name="book" :size="22" />
          <span>Gestion Scolaire</span>
        </div>
        <router-link to="/inscription" class="auth-header-link">Inscription</router-link>
      </div>
    </header>

    <div class="auth-bg" />
    <div class="auth-shell">
      <div class="auth-card">
        <section class="auth-left">
          <div class="auth-left-inner">
            <h2 class="auth-left-title">Welcome Back!</h2>
            <p class="auth-left-subtitle">Connectez-vous pour accéder à vos espaces (Professeur, Responsable, Parent).</p>
            <button type="button" class="auth-left-btn" @click="goToHome">
              Accueil
            </button>
          </div>
        </section>

        <section class="auth-right">
          <div class="auth-right-top">
            <h3 class="auth-right-title">Connexion</h3>
            <div class="auth-social">
              <button class="social-btn" type="button" aria-label="Google" title="Google">G</button>
              <button class="social-btn" type="button" aria-label="Facebook" title="Facebook">f</button>
              <button class="social-btn" type="button" aria-label="GitHub" title="GitHub">⌂</button>
              <button class="social-btn" type="button" aria-label="LinkedIn" title="LinkedIn">in</button>
            </div>
            <p class="auth-or">ou utilisez votre code d'accès</p>
          </div>

          <form @submit.prevent="handleLogin" class="auth-form">
            <label class="auth-label">Code d'accès</label>
            <input
              v-model="code"
              type="text"
              placeholder="Code professeur ou code secret élève"
              required
              autofocus
              class="auth-input"
              :disabled="loading"
            />

            <p class="auth-hint">Astuce : les parents utilisent le code secret de l'élève.</p>

            <div v-if="error" class="auth-error">
              {{ error }}
            </div>

            <button type="submit" class="auth-submit" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              <span v-else>SE CONNECTER</span>
            </button>
          </form>

          <div class="auth-links">
            <router-link to="/inscription" class="auth-link">Créer un compte professeur</router-link>
            <button type="button" class="auth-link auth-link-secondary" @click="goToHome">Retour à l'accueil</button>
          </div>
        </section>
      </div>
    </div>

    <footer class="auth-footer">
      <div class="auth-footer-inner">
        <p>&copy; 2024 Système de Gestion Scolaire. Tous droits réservés.</p>
      </div>
    </footer>
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
.auth-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.auth-header {
  position: relative;
  z-index: 2;
  background: linear-gradient(135deg, #1e88e5 0%, #1565c0 60%, #0d47a1 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
}

.auth-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.auth-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.12);
  color: white;
  cursor: pointer;
  font-weight: 700;
}

.auth-back:hover {
  background: rgba(255, 255, 255, 0.18);
}

.auth-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-weight: 800;
}

.auth-header-link {
  color: white;
  font-weight: 800;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.10);
}

.auth-header-link:hover {
  background: rgba(255, 255, 255, 0.18);
}

.auth-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 20%, rgba(30, 136, 229, 0.18) 0%, transparent 55%),
              radial-gradient(circle at 70% 70%, rgba(13, 71, 161, 0.16) 0%, transparent 60%),
              linear-gradient(135deg, #eef7ff 0%, #f7fbff 45%, #ffffff 100%);
  z-index: 0;
}

.auth-shell {
  width: 100%;
  max-width: 980px;
  position: relative;
  z-index: 1;
  margin: auto;
  padding: 32px 16px;
}

.auth-card {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.18);
  min-height: 520px;
}

.auth-left {
  background: linear-gradient(135deg, #1e88e5 0%, #1565c0 55%, #0d47a1 100%);
  position: relative;
  padding: 48px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-left::after {
  display: none; /* bande latérale supprimée pour ne pas masquer le contenu */
}

.auth-left-inner {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  max-width: 320px;
}

.auth-left-title {
  margin: 0 0 12px 0;
  font-size: 2rem;
  font-weight: 800;
}

.auth-left-subtitle {
  margin: 0 0 24px 0;
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.92;
}

.auth-left-btn {
  padding: 12px 22px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  background: transparent;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.auth-left-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.auth-right {
  padding: 44px 52px 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-right-title {
  margin: 0 0 12px 0;
  font-size: 1.9rem;
  font-weight: 800;
  color: #1f2937;
  text-align: center;
}

.auth-social {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 8px 0 10px;
}

.social-btn {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  transition: transform 0.15s, box-shadow 0.15s;
}

.social-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.10);
}

.auth-or {
  margin: 0 0 18px 0;
  text-align: center;
  font-size: 0.9rem;
  color: #6b7280;
}

.auth-form {
  display: grid;
  gap: 12px;
}

.auth-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #374151;
}

.auth-input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #fbfdff;
}

.auth-input:focus {
  border-color: #1565c0;
  box-shadow: 0 0 0 4px rgba(30, 136, 229, 0.16);
}

.auth-hint {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.auth-error {
  padding: 10px 12px;
  border-radius: 10px;
  background: #fdecec;
  color: #b42318;
  font-weight: 600;
  font-size: 0.95rem;
}

.auth-submit {
  margin-top: 6px;
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
  color: white;
  font-weight: 800;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
  box-shadow: 0 10px 26px rgba(13, 71, 161, 0.22);
}

.auth-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 34px rgba(13, 71, 161, 0.26);
}

.auth-submit:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  vertical-align: middle;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-links {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.auth-link {
  color: #1565c0;
  font-weight: 700;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}

.auth-link-secondary {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

.auth-footer {
  position: relative;
  z-index: 2;
  background: #0b2f6b;
  color: white;
  padding: 18px 16px;
  text-align: center;
}

.auth-footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  opacity: 0.95;
  font-weight: 600;
}

@media (max-width: 820px) {
  .auth-card {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .auth-left {
    padding: 40px 24px;
  }

  .auth-left::after {
    display: none;
  }

  .auth-right {
    padding: 36px 24px 28px;
  }
}
</style>
