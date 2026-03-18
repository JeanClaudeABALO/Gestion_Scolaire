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
        <span class="auth-header-link auth-header-link--ghost">Espace Parent</span>
      </div>
    </header>

    <div class="auth-bg" />
    <div class="auth-shell">
      <div class="auth-card">
        <section class="auth-left">
          <div class="auth-left-inner">
            <h2 class="auth-left-title">Accès Parent</h2>
            <p class="auth-left-subtitle">
              Entrez le code secret de votre enfant pour consulter ses informations et ses notes.
            </p>
            <div class="auth-left-badge">
              <Icon name="family" :size="18" />
              <span>Connexion rapide et sécurisée</span>
            </div>
            <button type="button" class="auth-left-btn" @click="goToHome">
              Accueil
            </button>
          </div>
        </section>

        <section class="auth-right">
          <div class="auth-right-top">
            <h3 class="auth-right-title">Connexion Parent</h3>
            <p class="auth-or">Utilisez le code secret de l'élève</p>
          </div>

          <form @submit.prevent="handleAccess" class="auth-form">
            <label class="auth-label" for="code-secret">Code secret</label>
            <input
              v-model="codeSecret"
              type="text"
              id="code-secret"
              placeholder="Ex: AB12CD34"
              required
              autofocus
              class="auth-input"
              :disabled="loading"
            />
            <p class="auth-hint">Ce code vous a été communiqué lors de l'inscription de votre enfant.</p>

            <div v-if="error" class="auth-error">
              <Icon name="warning" :size="18" />
              <span>{{ error }}</span>
            </div>

            <button type="submit" class="auth-submit" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              <span v-else>ACCÉDER À L'ESPACE</span>
            </button>
          </form>

          <div class="auth-links">
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
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 60%, var(--primary-700) 100%);
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

.auth-header-link--ghost {
  cursor: default;
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
  box-shadow: var(--shadow-lg, 0 18px 55px rgba(0, 0, 0, 0.18));
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.auth-left {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
  color: white;
  padding: 34px 28px;
  position: relative;
}

.auth-left-inner {
  max-width: 320px;
}

.auth-left-title {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 0.2px;
  margin: 0 0 10px 0;
}

.auth-left-subtitle {
  margin: 0 0 18px 0;
  opacity: 0.95;
  line-height: 1.55;
  font-weight: 600;
}

.auth-left-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.12);
  margin-bottom: 18px;
  font-weight: 700;
}

.auth-left-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-weight: 900;
  cursor: pointer;
}

.auth-left-btn:hover {
  background: rgba(255, 255, 255, 0.22);
}

.auth-right {
  padding: 34px 28px;
}

.auth-right-title {
  margin: 0 0 6px 0;
  font-size: 22px;
  font-weight: 900;
  color: var(--text-900, #1f2937);
}

.auth-or {
  margin: 0;
  color: var(--muted-600, #6b7280);
  font-weight: 700;
}

.auth-form {
  margin-top: 18px;
  display: grid;
  gap: 10px;
}

.auth-label {
  font-weight: 800;
  color: var(--text-700, #374151);
}

.auth-input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1.5px solid rgba(148, 163, 184, 0.7);
  outline: none;
  font-size: 16px;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.auth-input:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 4px rgba(30, 136, 229, 0.18);
}

.auth-hint {
  margin: 0;
  color: var(--muted-600, #6b7280);
  font-weight: 600;
  font-size: 13px;
}

.auth-error {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-weight: 700;
}

.auth-submit {
  width: 100%;
  margin-top: 6px;
  padding: 12px 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 55%, var(--primary-700) 100%);
  color: white;
  font-weight: 900;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.auth-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(13, 71, 161, 0.28);
  filter: brightness(1.03);
}

.auth-submit:disabled {
  opacity: 0.75;
  cursor: not-allowed;
  transform: none;
}

.auth-links {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.auth-link {
  border: none;
  background: transparent;
  color: var(--primary-700);
  font-weight: 800;
  cursor: pointer;
  padding: 0;
}

.auth-link-secondary {
  color: var(--muted-600, #6b7280);
  font-weight: 700;
}

.auth-footer {
  position: relative;
  z-index: 1;
  padding: 18px 0;
  color: var(--muted-600, #6b7280);
  text-align: center;
}

.auth-footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 18px;
}

.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid #fff;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .auth-card {
    grid-template-columns: 1fr;
  }
  .auth-left-inner {
    max-width: none;
  }
}
</style>
