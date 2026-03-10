<template>
  <div class="inscription-page">
    <!-- Header même style que Connexion -->
    <header class="inscription-header">
      <div class="header-content">
        <button @click="goToHome" class="btn-home">
          <Icon name="arrow-left" :size="18" class="home-icon" />
          Retour à l'accueil
        </button>
        <div class="header-logo">
          <Icon name="book" :size="24" class="logo-icon" />
          <span class="logo-text">Gestion Scolaire</span>
        </div>
        <div class="header-nav">
          <button @click="goToLogin" class="btn-nav-secondary">Connexion</button>
        </div>
      </div>
    </header>

    <!-- Fond avec même image que Connexion + carte deux colonnes -->
    <div class="inscription-bg">
      <div class="inscription-wrapper">
        <div class="inscription-card">
          <!-- Panneau gauche : branding bleu ciel (comme Connexion) -->
          <div class="inscription-card-left">
            <div class="left-content">
              <Icon name="book" :size="72" class="left-icon" />
              <h2 class="left-title">Inscription Professeur</h2>
              <p class="left-subtitle">Créez votre compte pour accéder au système. Gérez vos classes, matières et saisissez les notes de vos élèves.</p>
            </div>
          </div>

          <!-- Panneau droit : formulaire -->
          <div class="inscription-card-right">
            <div class="welcome-banner">Créer un compte</div>
            <h3 class="form-title">Inscrivez-vous</h3>

            <template v-if="!codeGenere">
              <form @submit.prevent="handleInscription" class="inscription-form">
                <div class="form-section">
                  <h4 class="form-section-title">Informations personnelles</h4>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Nom <span class="required">*</span></label>
                      <input v-model="form.nom" type="text" class="form-input" placeholder="Votre nom" required />
                    </div>
                    <div class="form-group">
                      <label>Prénom(s) <span class="required">*</span></label>
                      <input v-model="form.prenom" type="text" class="form-input" placeholder="Votre prénom" required />
                    </div>
                  </div>
                </div>

                <div class="form-section">
                  <h4 class="form-section-title">Matières enseignées (optionnel)</h4>
                  <div class="matieres-select-wrapper">
                    <select v-model="selectedMatiereId" class="form-select-single" @change="onMatiereSelect">
                      <option value="">Choisir une matière à ajouter...</option>
                      <option v-for="matiere in matieresRestantes" :key="matiere.id" :value="matiere.id">
                        {{ matiere.nom }} – {{ matiere.classe_nom }}
                      </option>
                    </select>
                    <div class="matieres-tags" v-if="form.matieres.length > 0">
                      <span
                        v-for="id in form.matieres"
                        :key="id"
                        class="matiere-tag"
                      >
                        {{ labelMatiere(id) }}
                        <button type="button" class="matiere-tag-remove" @click="removeMatiere(id)" aria-label="Retirer">×</button>
                      </span>
                    </div>
                  </div>
                  <small class="form-hint">Choisissez une matière dans la liste pour l'ajouter. Vous pouvez en ajouter plusieurs.</small>
                </div>

                <div class="form-section">
                  <h4 class="form-section-title">Type de compte</h4>
                  <div class="role-selection">
                    <label class="role-option">
                      <input v-model="form.role" type="radio" value="PROF" class="role-radio" required />
                      <div class="role-card" :class="{ active: form.role === 'PROF' }">
                        <Icon name="teacher" :size="36" class="role-icon" />
                        <div>
                          <strong>Professeur</strong>
                          <p>Classes, matières, saisie des notes</p>
                        </div>
                      </div>
                    </label>
                    <label class="role-option">
                      <input v-model="form.role" type="radio" value="ADMIN" class="role-radio" required />
                      <div class="role-card" :class="{ active: form.role === 'ADMIN' }">
                        <Icon name="admin" :size="36" class="role-icon" />
                        <div>
                          <strong>Administrateur</strong>
                          <p>Gestion complète</p>
                          <small v-if="adminExists" class="role-warning">Un admin existe déjà.</small>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div v-if="error" class="error-message">{{ error }}</div>

                <div class="form-actions">
                  <button type="button" class="btn-cancel" @click="goToHome">Annuler</button>
                  <button type="submit" class="btn-submit" :disabled="loading">
                    {{ loading ? 'Inscription...' : 'S\'inscrire' }}
                  </button>
                </div>
              </form>
            </template>

            <!-- Succès + code -->
            <div v-else class="code-display">
              <div class="success-icon-wrap">
                <Icon name="check" :size="48" class="text-success" />
              </div>
              <h3 class="code-display-title">Inscription réussie</h3>
              <p class="success-message">Votre compte a été créé.</p>
              <div class="code-box">
                <p class="code-label">Votre code d'accès personnel</p>
                <div class="code-value">{{ codeGenere }}</div>
              </div>
              <div class="code-warning">
                <strong>Important :</strong> Conservez ce code ; il ne sera plus affiché. En cas d'oubli, contactez le responsable.
              </div>
              <div class="code-actions">
                <button type="button" class="btn-cancel" @click="copyCode">Copier le code</button>
                <button type="button" class="btn-submit" @click="goToLogin">Se connecter</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    const loading = ref(false)
    const error = ref('')
    const codeGenere = ref('')
    const adminExists = ref(false)

    const matieresRestantes = computed(() => {
      const ids = form.value.matieres || []
      return matieresDisponibles.value.filter(m => !ids.includes(m.id))
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
      try {
        const r = await api.get('/auth/matieres')
        matieresDisponibles.value = Array.isArray(r.data) ? r.data : []
      } catch (e) {
        console.error('Erreur chargement matières:', e)
        matieresDisponibles.value = []
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
.inscription-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header même que Connexion */
.inscription-header {
  background: linear-gradient(135deg, #5dade2 0%, #3498db 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 14px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.inscription-header .header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inscription-header .btn-home {
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

.inscription-header .btn-home:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
}

.inscription-header .header-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.inscription-header .logo-icon { font-size: 24px; color: white; }
.inscription-header .logo-text { color: white; }

.btn-nav-secondary {
  padding: 8px 16px;
  background: white;
  color: #3498db;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.25s;
}

.btn-nav-secondary:hover {
  background: rgba(255, 255, 255, 0.9);
  color: #2980b9;
}

/* Fond même image que Connexion */
.inscription-bg {
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

.inscription-wrapper {
  width: 100%;
  max-width: 960px;
}

.inscription-card {
  display: flex;
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  min-height: 520px;
  max-height: 85vh;
}

.inscription-card-left {
  width: 38%;
  min-width: 260px;
  background: linear-gradient(160deg, #5dade2 0%, #3498db 100%);
  padding: 40px 36px;
  display: flex;
  align-items: center;
}

.left-content { color: white; text-align: center; }
.left-icon { opacity: 0.95; margin-bottom: 20px; }
.left-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 12px 0; color: white; }
.left-subtitle { font-size: 0.9rem; line-height: 1.55; opacity: 0.92; margin: 0; }

.inscription-card-right {
  flex: 1;
  padding: 32px 40px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.welcome-banner {
  background: linear-gradient(135deg, #7ec8e3 0%, #5dade2 100%);
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 8px 16px;
  border-radius: 10px;
  margin-bottom: 16px;
  align-self: flex-start;
}

.form-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 20px 0;
}

.inscription-form { display: flex; flex-direction: column; gap: 18px; }

.form-section { margin-bottom: 4px; }
.form-section-title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #7f8c8d;
  margin-bottom: 10px;
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-weight: 600; color: #34495e; font-size: 13px; }
.required { color: #e74c3c; }

.form-input {
  padding: 10px 12px;
  border: none;
  border-bottom: 2px solid #ecf0f1;
  font-size: 15px;
  background: transparent;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-bottom-color: #5dade2;
}

.matieres-select-wrapper {
  border: 2px solid #ecf0f1;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fafafa;
  min-height: 48px;
}

.form-select-single {
  width: 100%;
  padding: 8px 10px;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #2c3e50;
  cursor: pointer;
  border-radius: 6px;
}

.form-select-single:focus {
  outline: none;
}

.matieres-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.matiere-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: linear-gradient(135deg, #e8f4fc 0%, #d6eaf8 100%);
  border: 1px solid #3498db;
  border-radius: 8px;
  font-size: 13px;
  color: #2980b9;
  font-weight: 500;
}

.matiere-tag-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  background: rgba(52, 152, 219, 0.2);
  color: #2980b9;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  transition: background 0.2s, color 0.2s;
}

.matiere-tag-remove:hover {
  background: #3498db;
  color: white;
}

.form-hint { color: #95a5a6; font-size: 11px; margin-top: 8px; }

.role-selection { display: flex; flex-direction: column; gap: 10px; }
.role-option { cursor: pointer; }
.role-radio { display: none; }

.role-card {
  border: 2px solid #ecf0f1;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.2s;
}

.role-card:hover { border-color: #5dade2; }
.role-card.active { border-color: #3498db; background: rgba(93, 173, 226, 0.08); }
.role-icon { color: #3498db; flex-shrink: 0; }
.role-card strong { display: block; color: #2c3e50; font-size: 0.95rem; }
.role-card p { margin: 2px 0 0 0; color: #7f8c8d; font-size: 0.85rem; }
.role-warning { display: block; color: #e74c3c; font-size: 0.8rem; margin-top: 4px; }

.error-message {
  padding: 10px 14px;
  background: #fde8e8;
  color: #c0392b;
  border-radius: 10px;
  font-size: 13px;
}

.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }

.btn-cancel {
  padding: 10px 20px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-cancel:hover { background: #7f8c8d; }

.btn-submit {
  padding: 10px 20px;
  background: linear-gradient(135deg, #5dade2 0%, #3498db 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 14px rgba(52, 152, 219, 0.35);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(52, 152, 219, 0.4);
}

.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

/* Code display */
.code-display { text-align: center; padding: 10px 0; }
.success-icon-wrap { margin-bottom: 12px; }
.text-success { color: #27ae60; }
.code-display-title { font-size: 1.25rem; font-weight: 700; color: #27ae60; margin: 0 0 8px 0; }
.success-message { color: #7f8c8d; font-size: 0.95rem; margin-bottom: 20px; }
.code-box {
  background: #f8f9fa;
  border: 2px solid #3498db;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}
.code-label { font-weight: 600; color: #2c3e50; margin-bottom: 8px; font-size: 0.95rem; }
.code-value { font-size: 1.5rem; font-weight: 700; color: #3498db; letter-spacing: 2px; font-family: monospace; word-break: break-all; }
.code-warning {
  background: #fff8e6;
  border: 1px solid #f1c40f;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #856404;
  text-align: left;
}
.code-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

@media (max-width: 768px) {
  .inscription-card { flex-direction: column; max-height: none; min-height: auto; }
  .inscription-card-left { width: 100%; min-width: 0; padding: 28px 24px; }
  .inscription-card-right { padding: 24px; }
  .form-row { grid-template-columns: 1fr; }
  .inscription-header .header-content { flex-wrap: wrap; gap: 12px; padding: 0 20px; }
}
</style>
