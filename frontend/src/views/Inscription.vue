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
        <button type="button" class="auth-header-link" @click="goToLogin">Connexion</button>
      </div>
    </header>

    <div class="auth-bg" />
    <div class="auth-shell">
      <div class="auth-card auth-card--tall">
        <section class="auth-left">
          <div class="auth-left-inner">
            <h2 class="auth-left-title">Create Account</h2>
            <p class="auth-left-subtitle">Inscrivez-vous pour obtenir votre code d'accès professeur.</p>
            <button type="button" class="auth-left-btn" @click="goToLogin">
              Se connecter
            </button>
          </div>
        </section>

        <section class="auth-right">
          <div class="auth-right-top">
            <h3 class="auth-right-title">Inscription</h3>
            <div class="auth-social">
              <button class="social-btn" type="button" aria-label="Google" title="Google">G</button>
              <button class="social-btn" type="button" aria-label="Facebook" title="Facebook">f</button>
              <button class="social-btn" type="button" aria-label="GitHub" title="GitHub">⌂</button>
              <button class="social-btn" type="button" aria-label="LinkedIn" title="LinkedIn">in</button>
            </div>
            <p class="auth-or">ou utilisez le formulaire ci-dessous</p>
          </div>

          <template v-if="!codeGenere">
            <form @submit.prevent="handleInscription" class="auth-form auth-form--grid">
              <div>
                <label class="auth-label">Nom</label>
                <input v-model="form.nom" type="text" class="auth-input" placeholder="Votre nom" required />
              </div>
              <div>
                <label class="auth-label">Prénom(s)</label>
                <input v-model="form.prenom" type="text" class="auth-input" placeholder="Votre prénom" required />
              </div>

              <div class="auth-full">
                <label class="auth-label">Matières enseignées (optionnel)</label>
                <div class="auth-matieres">
                  <p v-if="loadingMatieres" class="auth-mini">Chargement des matières...</p>
                  <p v-else-if="erreurMatieres" class="auth-mini auth-mini-error">
                    {{ erreurMatieres }}
                    <button type="button" class="auth-mini-link" @click="loadMatieres">Recharger</button>
                  </p>
                  <template v-else>
                    <p v-if="matieresDisponibles.length === 0" class="auth-mini">
                      Aucune matière en base.
                    </p>
                    <template v-else>
                      <select v-model="selectedMatiereId" class="auth-select" @change="onMatiereSelect">
                        <option value="">Choisir une matière à ajouter...</option>
                        <option v-for="matiere in matieresRestantes" :key="matiere.id" :value="matiere.id">
                          {{ matiere.nom }} – {{ matiere.classe_nom }}
                        </option>
                      </select>
                      <div class="auth-tags" v-if="form.matieres.length > 0">
                        <span v-for="id in form.matieres" :key="id" class="auth-tag">
                          {{ labelMatiere(id) }}
                          <button type="button" class="auth-tag-x" @click="removeMatiere(id)" aria-label="Retirer">×</button>
                        </span>
                      </div>
                    </template>
                  </template>
                </div>
              </div>

              <div class="auth-full">
                <label class="auth-label">Type de compte</label>
                <div class="auth-role">
                  <label class="auth-role-item">
                    <input v-model="form.role" type="radio" value="PROF" class="auth-radio" required />
                    <span class="auth-role-pill">Professeur</span>
                  </label>
                  <label class="auth-role-item">
                    <input v-model="form.role" type="radio" value="ADMIN" class="auth-radio" required />
                    <span class="auth-role-pill">Administrateur</span>
                    <span v-if="adminExists" class="auth-admin-warn">Un admin existe déjà</span>
                  </label>
                </div>
              </div>

              <div v-if="error" class="auth-error auth-full">{{ error }}</div>

              <button type="submit" class="auth-submit auth-full" :disabled="loading">
                {{ loading ? 'INSCRIPTION...' : 'S\'INSCRIRE' }}
              </button>
            </form>

            <div class="auth-links">
              <button type="button" class="auth-link auth-link-secondary" @click="goToHome">Retour à l'accueil</button>
              <button type="button" class="auth-link auth-link-secondary" @click="goToLogin">Déjà un compte ?</button>
            </div>
          </template>

          <div v-else class="auth-success">
            <div class="auth-success-title">Inscription réussie</div>
            <p class="auth-mini">Votre code d'accès personnel :</p>
            <div class="auth-code">{{ codeGenere }}</div>
            <p class="auth-mini auth-mini-warn"><strong>Important :</strong> Conservez ce code. Il ne sera plus affiché.</p>
            <div class="auth-success-actions">
              <button type="button" class="auth-submit" @click="copyCode">COPIER</button>
              <button type="button" class="auth-submit auth-submit--ghost" @click="goToLogin">SE CONNECTER</button>
            </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import Icon from '../components/Icons.vue'

export default {
  name: 'Inscription',
  components: { Icon },
  setup() {
    const router = useRouter()
    const form = ref({ nom: '', prenom: '', matieres: [], role: 'PROF' })
    const selectedMatiereId = ref('')
    const matieresDisponibles = ref([])
    const loadingMatieres = ref(true)
    const erreurMatieres = ref('')
    const loading = ref(false)
    const error = ref('')
    const codeGenere = ref('')
    const adminExists = ref(false)

    const matieresRestantes = computed(() => {
      const ids = new Set((form.value.matieres || []).map(id => Number(id)))
      return matieresDisponibles.value.filter(m => !ids.has(Number(m.id)))
    })

    const labelMatiere = (id) => {
      const m = matieresDisponibles.value.find(m => m.id === id)
      return m ? `${m.nom} (${m.classe_nom})` : ''
    }

    const onMatiereSelect = () => {
      const id = selectedMatiereId.value
      if (!id) return
      const numId = Number(id) || id
      const ids = form.value.matieres || []
      if (!ids.some(m => m === numId || m === id)) {
        form.value.matieres = [...ids, numId]
      }
      selectedMatiereId.value = ''
    }

    const removeMatiere = (id) => {
      form.value.matieres = (form.value.matieres || []).filter(m => m !== id)
    }

    const loadMatieres = async () => {
      loadingMatieres.value = true
      erreurMatieres.value = ''
      try {
        const r = await api.get('/auth/matieres')
        const data = r?.data
        if (Array.isArray(data)) {
          matieresDisponibles.value = data
        } else if (data && Array.isArray(data.matieres)) {
          matieresDisponibles.value = data.matieres
        } else {
          matieresDisponibles.value = []
        }
      } catch (e) {
        console.error('Erreur chargement matières:', e)
        matieresDisponibles.value = []
        const msg = e.response?.data?.message || e.message || 'Connexion impossible'
        erreurMatieres.value = `Impossible de charger les matières (${msg}). Vérifiez que le backend tourne sur http://localhost:5000.`
      } finally {
        loadingMatieres.value = false
      }
    }
    const checkAdminExists = async () => {
      try {
        const r = await api.get('/auth/check-admin')
        adminExists.value = r.data.exists
      } catch (e) { console.error(e) }
    }

    const handleInscription = async () => {
      error.value = ''
      loading.value = true
      try {
        const r = await api.post('/auth/inscription', {
          nom: form.value.nom,
          prenom: form.value.prenom,
          matieres: form.value.matieres || [],
          role: form.value.role
        })
        codeGenere.value = r.data.code_professeur
      } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors de l\'inscription'
      } finally {
        loading.value = false
      }
    }

    const copyCode = () => {
      navigator.clipboard.writeText(codeGenere.value).then(() => alert('Code copié !'))
    }
    const goToHome = () => router.push('/')
    const goToLogin = () => router.push({ name: 'Login' })

    onMounted(() => Promise.all([loadMatieres(), checkAdminExists()]))

    return {
      form,
      selectedMatiereId,
      matieresDisponibles,
      matieresRestantes,
      loadingMatieres,
      erreurMatieres,
      loadMatieres,
      labelMatiere,
      onMatiereSelect,
      removeMatiere,
      loading,
      error,
      codeGenere,
      adminExists,
      handleInscription,
      copyCode,
      goToHome,
      goToLogin
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
  cursor: pointer;
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
  max-width: 1040px;
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
  min-height: 560px;
}

.auth-card--tall {
  min-height: 640px;
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
  max-width: 340px;
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

.auth-form--grid {
  grid-template-columns: 1fr 1fr;
  gap: 12px 14px;
}

.auth-full {
  grid-column: 1 / -1;
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
  box-sizing: border-box;
}

.auth-input:focus {
  border-color: #1565c0;
  box-shadow: 0 0 0 4px rgba(30, 136, 229, 0.16);
}

.auth-select {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 0.98rem;
  background: #fbfdff;
  outline: none;
}

.auth-matieres {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #eef2ff;
  background: #f9fbff;
}

.auth-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.auth-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(30, 136, 229, 0.22);
  background: rgba(30, 136, 229, 0.08);
  color: #0d47a1;
  font-weight: 700;
  font-size: 0.9rem;
}

.auth-tag-x {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background: rgba(13, 71, 161, 0.16);
  color: #0d47a1;
  cursor: pointer;
  line-height: 18px;
  padding: 0;
  font-weight: 900;
}

.auth-tag-x:hover {
  background: rgba(13, 71, 161, 0.24);
}

.auth-mini {
  margin: 0;
  font-size: 0.88rem;
  color: #6b7280;
  line-height: 1.5;
}

.auth-mini-error {
  color: #b42318;
  font-weight: 600;
}

.auth-mini-link {
  margin-left: 8px;
  border: none;
  background: transparent;
  color: #1565c0;
  font-weight: 800;
  cursor: pointer;
  padding: 0;
}

.auth-mini-warn {
  color: #7a5c00;
}

.auth-role {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  align-items: center;
}

.auth-role-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
}

.auth-radio {
  accent-color: #1565c0;
}

.auth-role-pill {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-weight: 800;
  color: #374151;
}

.auth-admin-warn {
  font-size: 0.85rem;
  color: #b42318;
  font-weight: 700;
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

.auth-submit--ghost {
  background: #ffffff;
  color: #1565c0;
  border: 1px solid #e5e7eb;
  box-shadow: none;
}

.auth-success {
  text-align: center;
  padding: 8px 0;
}

.auth-success-title {
  font-size: 1.25rem;
  font-weight: 900;
  color: #15803d;
  margin-bottom: 10px;
}

.auth-code {
  display: inline-block;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
  font-weight: 900;
  font-size: 1.6rem;
  letter-spacing: 0.16em;
  color: #0d47a1;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(30, 136, 229, 0.25);
  background: rgba(30, 136, 229, 0.08);
  margin: 10px 0 14px;
}

.auth-success-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 10px;
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

@media (max-width: 920px) {
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

  .auth-form--grid {
    grid-template-columns: 1fr;
  }
}
</style>
