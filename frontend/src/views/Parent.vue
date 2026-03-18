<template>
  <div class="parent-container">
    <video
      class="parent-bg-video"
      src="/parent.webm"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
    ></video>
    <header class="header">
      <h1>Espace Parent</h1>
      <button @click="logout" class="btn-logout">Déconnexion</button>
    </header>

    <div class="content">
      <div v-if="loading" class="loading">Chargement...</div>
      <div v-else-if="eleve" class="eleve-info">
        <div class="welcome-card">
          <div class="welcome-top">
            <h2 class="welcome-title">Bienvenue dans l’Espace Parent</h2>
            <p class="welcome-subtitle">
              Retrouvez ici les informations et les résultats de votre enfant, trimestre par trimestre.
            </p>
          </div>
          <div class="welcome-highlight">
            <span class="welcome-label">Élève</span>
            <span class="welcome-name">{{ eleve.prenom }} {{ eleve.nom }}</span>
            <span class="welcome-meta">— {{ eleve.classe_nom }} • {{ eleve.filiere_nom }}</span>
          </div>
        </div>

        <div class="filters-card" v-if="notesData && notesData.matieres && notesData.matieres.length">
          <div class="filters-head">
            <h3 class="filters-title">Filtres</h3>
            <button type="button" class="filters-reset" @click="resetFilters">Réinitialiser</button>
          </div>
          <div class="filters-grid">
            <div class="filter-item">
              <label for="filter-matiere">Matière</label>
              <select id="filter-matiere" v-model="selectedMatiereId">
                <option value="all">Toutes les matières</option>
                <option v-for="m in matieresOptions" :key="m.matiere_id" :value="String(m.matiere_id)">
                  {{ m.matiere_nom }}
                </option>
              </select>
            </div>
            <div class="filter-item">
              <label for="filter-trimestre">Trimestre</label>
              <select id="filter-trimestre" v-model="selectedTrimestre">
                <option value="all">Tous</option>
                <option value="1">Trimestre 1</option>
                <option value="2">Trimestre 2</option>
                <option value="3">Trimestre 3</option>
              </select>
            </div>
          </div>
        </div>

        <div class="info-card">
          <h2>Informations de l'élève</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Nom complet</label>
              <p>{{ eleve.prenom }} {{ eleve.nom }}</p>
            </div>
            <div class="info-item">
              <label>Classe</label>
              <p>{{ eleve.classe_nom }}</p>
            </div>
            <div class="info-item">
              <label>Filière</label>
              <p>{{ eleve.filiere_nom }}</p>
            </div>
          </div>
        </div>

        <div class="notes-section">
          <h2>Notes de l'élève</h2>
          <div v-if="notesLoading" class="loading">Chargement des notes...</div>
          <div v-else-if="!notesData || notesData.matieres.length === 0" class="empty">Aucune note enregistrée</div>
          <div v-else>
            <div v-for="matiere in filteredMatieres" :key="matiere.matiere_id" class="matiere-section">
              <h3 class="matiere-title">{{ matiere.matiere_nom }}</h3>
              <div v-for="trimestre in filteredTrimestres(matiere.trimestres)" :key="trimestre.trimestre" class="trimestre-section">
                <h4 class="trimestre-title">Trimestre {{ trimestre.trimestre }}</h4>
                <div class="table-container">
                  <table class="notes-table">
                    <thead>
                      <tr>
                        <th colspan="5" class="section-header">Interrogations</th>
                        <th rowspan="2" class="section-header">Moy. Int.</th>
                        <th colspan="3" class="section-header">Devoirs</th>
                        <th rowspan="2">Coeff.</th>
                        <th rowspan="2">Moyenne</th>
                        <th rowspan="2">Moy. Coeff.</th>
                      </tr>
                      <tr>
                        <th>Int. 1</th>
                        <th>Int. 2</th>
                        <th>Int. 3</th>
                        <th>Int. 4</th>
                        <th>Int. 5</th>
                        <th>Dev. 1</th>
                        <th>Dev. 2</th>
                        <th>Dev. 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td v-for="(note, index) in trimestre.interrogations" :key="`int-${index}`" class="note-cell">
                          {{ note !== null ? note : '—' }}
                        </td>
                        <td class="moyenne-cell" :class="{ 'no-data': trimestre.moyenneInterrogations === null }">
                          {{ trimestre.moyenneInterrogations !== null ? trimestre.moyenneInterrogations : '—' }}
                        </td>
                        <td v-for="(note, index) in trimestre.devoirs" :key="`dev-${index}`" class="note-cell">
                          {{ note !== null ? note : '—' }}
                        </td>
                        <td class="coeff-cell">{{ trimestre.coefficient }}</td>
                        <td class="moyenne-cell" :class="{ 'no-data': trimestre.moyenne === null }">
                          {{ trimestre.moyenne !== null ? trimestre.moyenne : '—' }}
                        </td>
                        <td class="moyenne-cell" :class="{ 'no-data': trimestre.moyenneCoefficientee === null }">
                          {{ trimestre.moyenneCoefficientee !== null ? trimestre.moyenneCoefficientee : '—' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import api from '../services/api'

export default {
  name: 'Parent',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const eleve = ref(null)
    const notesData = ref(null)
    const loading = ref(true)
    const notesLoading = ref(true)
    const selectedMatiereId = ref('all')
    const selectedTrimestre = ref('all')

    const matieresOptions = computed(() => {
      if (!notesData.value || !notesData.value.matieres) return []
      return notesData.value.matieres.map(m => ({ matiere_id: m.matiere_id, matiere_nom: m.matiere_nom }))
    })

    const filteredMatieres = computed(() => {
      const matieres = notesData.value?.matieres || []
      if (selectedMatiereId.value === 'all') return matieres
      return matieres.filter(m => String(m.matiere_id) === String(selectedMatiereId.value))
    })

    const filteredTrimestres = (trimestres) => {
      if (!Array.isArray(trimestres)) return []
      if (selectedTrimestre.value === 'all') return trimestres
      return trimestres.filter(t => String(t.trimestre) === String(selectedTrimestre.value))
    }

    const resetFilters = () => {
      selectedMatiereId.value = 'all'
      selectedTrimestre.value = 'all'
    }

    const loadEleveInfo = async () => {
      try {
        const response = await api.get('/parent/eleve')
        eleve.value = response.data
      } catch (error) {
        console.error('Erreur chargement élève:', error)
      } finally {
        loading.value = false
      }
    }

    const loadNotes = async () => {
      notesLoading.value = true
      try {
        const response = await api.get('/parent/notes-organisees')
        notesData.value = response.data
      } catch (error) {
        console.error('Erreur chargement notes:', error)
        notesData.value = null
      } finally {
        notesLoading.value = false
      }
    }

    const logout = () => {
      authStore.logout()
      router.push('/')
    }

    onMounted(async () => {
      if (!authStore.isAuthenticated || !authStore.isParent) {
        router.push('/')
        return
      }
      await loadEleveInfo()
      await loadNotes()
    })

    watch(notesData, (val) => {
      // Si les notes changent, s'assurer que les filtres restent valides
      if (!val || !val.matieres || val.matieres.length === 0) {
        resetFilters()
      }
    })

    return {
      eleve,
      notesData,
      loading,
      notesLoading,
      selectedMatiereId,
      selectedTrimestre,
      matieresOptions,
      filteredMatieres,
      filteredTrimestres,
      resetFilters,
      logout
    }
  }
}
</script>

<style scoped>
.parent-container {
  min-height: 100vh;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
}

.parent-bg-video {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  opacity: 0.28;
  pointer-events: none;
  filter: saturate(1.05) contrast(1.05);
}

.header {
  background: linear-gradient(135deg, var(--primary-500, #1e88e5) 0%, var(--primary-600, #1565c0) 55%, var(--primary-700, #0d47a1) 100%);
  padding: 24px 40px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 28px rgba(13, 71, 161, 0.18);
  position: relative;
  z-index: 1;
  min-height: 72px;
}

.header h1 {
  margin: 0;
  color: white;
  font-weight: 900;
  font-size: 1.25rem;
  letter-spacing: 0.1px;
}

.btn-logout {
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.15s ease, background 0.25s ease;
}

.btn-logout:hover {
  background: #c82333;
  transform: translateY(-1px);
}

.content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
  position: relative;
  z-index: 1;
}

.eleve-info {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.welcome-card,
.filters-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.welcome-title {
  margin: 0 0 6px 0;
  font-size: 32px;
  font-weight: 900;
  color: var(--primary-700, #0d47a1);
}

.welcome-subtitle {
  margin: 0;
  color: #4b5563;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.5;
}

.welcome-highlight {
  margin-top: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(30, 136, 229, 0.10), rgba(13, 71, 161, 0.06));
  border: 1px solid rgba(30, 136, 229, 0.18);
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.welcome-label {
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--primary-700, #0d47a1);
  background: rgba(255, 255, 255, 0.65);
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(13, 71, 161, 0.18);
}

.welcome-name {
  font-weight: 900;
  color: #111827;
}

.welcome-meta {
  color: #374151;
  font-weight: 600;
}

.filters-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.filters-title {
  margin: 0;
  font-size: 16px;
  font-weight: 900;
  color: #111827;
}

.filters-reset {
  border: 1px solid rgba(148, 163, 184, 0.8);
  background: rgba(255, 255, 255, 0.8);
  color: #374151;
  font-weight: 800;
  padding: 8px 12px;
  border-radius: 12px;
  cursor: pointer;
}

.filters-reset:hover {
  border-color: var(--primary-600, #1565c0);
  color: var(--primary-700, #0d47a1);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.filter-item label {
  display: block;
  font-weight: 800;
  color: #374151;
  font-size: 14px;
  margin-bottom: 6px;
}

.filter-item select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1.5px solid rgba(148, 163, 184, 0.7);
  outline: none;
  font-weight: 700;
  background: white;
}

.filter-item select:focus {
  border-color: var(--primary-500, #1e88e5);
  box-shadow: 0 0 0 4px rgba(30, 136, 229, 0.18);
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.info-card h2 {
  margin-bottom: 20px;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item label {
  display: block;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-item p {
  font-size: 18px;
  color: #333;
}

.notes-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.notes-section h2 {
  margin-bottom: 25px;
  color: #333;
}

.matiere-section {
  margin-bottom: 40px;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.matiere-title {
  color: #3498db;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
}

.trimestre-section {
  margin-bottom: 25px;
}

.trimestre-title {
  color: #555;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  padding: 8px 12px;
  background: #e9ecef;
  border-radius: 6px;
  display: inline-block;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.notes-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-size: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.notes-table thead {
  background: linear-gradient(135deg, var(--primary-600, #1565c0), var(--primary-700, #0d47a1));
  color: white;
}

.notes-table th {
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  border: 1px solid rgba(255,255,255,0.2);
  font-size: 13px;
}

.section-header {
  background: #2980b9 !important;
}

.notes-table td {
  padding: 10px 8px;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.note-cell {
  font-weight: 500;
  color: #333;
}

.moyenne-cell {
  font-weight: 600;
  color: #3498db;
  background: #f0f4ff;
}

.moyenne-cell.no-data {
  color: #999;
  background: #f5f5f5;
}

.coeff-cell {
  font-weight: 600;
  color: #555;
  background: #f8f9fa;
}

.notes-table tbody tr:hover {
  background: #f8f9fa;
}

.loading, .empty {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}

.empty {
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #ddd;
}
</style>
