<template>
  <div class="parent-container">
    <header class="header">
      <h1>Espace Parent</h1>
      <button @click="logout" class="btn-logout">Déconnexion</button>
    </header>

    <div class="content">
      <div v-if="loading" class="loading">Chargement...</div>
      <div v-else-if="eleve" class="eleve-info">
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
            <div v-for="matiere in notesData.matieres" :key="matiere.matiere_id" class="matiere-section">
              <h3 class="matiere-title">{{ matiere.matiere_nom }}</h3>
              <div v-for="trimestre in matiere.trimestres" :key="trimestre.trimestre" class="trimestre-section">
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
import { ref, onMounted } from 'vue'
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

    return {
      eleve,
      notesData,
      loading,
      notesLoading,
      logout
    }
  }
}
</script>

<style scoped>
.parent-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: white;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-logout {
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: #c82333;
}

.content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
}

.eleve-info {
  display: flex;
  flex-direction: column;
  gap: 30px;
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
  background: #3498db;
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
