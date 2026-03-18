<template>
  <div class="professeur-container">
    <video
      class="prof-bg-video"
      src="/prof.webm"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
    ></video>
    <header class="header">
      <button type="button" class="btn-menu-mobile" aria-label="Menu" @click="sidebarOpen = !sidebarOpen">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <h1 class="header-title">Espace Professeur</h1>
      <div class="user-info">
        <span>{{ user?.prenom }} {{ user?.nom }}</span>
        <button @click="logout" class="btn-logout">Déconnexion</button>
      </div>
    </header>

    <div class="sidebar-overlay" :class="{ visible: sidebarOpen }" @click="sidebarOpen = false" aria-hidden="true"></div>
    <div class="content">
      <div class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
        <nav>
          <button 
            :class="['nav-btn', { active: activeView === 'classes' }]"
            @click="(goToClasses(), sidebarOpen = false)"
          >
            Mes Classes
          </button>
          <button 
            :class="['nav-btn', { active: activeView === 'matieres' }]"
            @click="(goToMatieres(), sidebarOpen = false)"
          >
            Mes Matières
          </button>
        </nav>
      </div>

      <div class="main-content" ref="mainContentRef">
        <!-- Vue Classes -->
        <div v-if="activeView === 'classes' && !selectedClasse" class="view">
          <h2>Mes Classes</h2>
          <div v-if="loading" class="loading">Chargement...</div>
          <div v-else-if="classes.length === 0" class="empty">Aucune classe assignée</div>
          <div v-else class="classes-grid">
            <div 
              v-for="classe in classes" 
              :key="classe.id"
              class="classe-card"
              @click="selectClasse(classe)"
            >
              <h3>{{ classe.nom }}</h3>
              <p>{{ classe.filiere_nom }}</p>
            </div>
          </div>
        </div>

        <!-- Vue Tableau des Élèves avec Notes -->
        <div v-if="selectedClasse && selectedMatiere" class="view">
          <div class="view-header">
            <button @click="goBackToClasse" class="btn-back">← Retour</button>
            <div class="header-info">
              <h2>{{ selectedClasse.nom }} - {{ selectedMatiere.nom }}</h2>
              <div class="filters">
                <label>Trimestre :</label>
                <select v-model="selectedTrimestre" @change="loadElevesWithNotes" class="select-trimestre">
                  <option :value="1">Trimestre 1</option>
                  <option :value="2">Trimestre 2</option>
                  <option :value="3">Trimestre 3</option>
                </select>
              </div>
            </div>
          </div>

          <div v-if="loadingEleves" class="loading">Chargement des données...</div>
          <div v-else-if="elevesWithNotes.length === 0" class="empty">Aucun élève dans cette classe</div>
          <div v-else class="table-container" ref="elevesTableRef">
            <div class="table-shell">
              <table class="notes-table">
              <thead>
                <tr>
                  <th rowspan="2" class="index-col">N°</th>
                  <th rowspan="2">Code</th>
                  <th rowspan="2">Nom</th>
                  <th rowspan="2">Prénom</th>
                  <th colspan="6" class="section-header">Interrogations</th>
                  <th colspan="3" class="section-header">Devoirs</th>
                  <th rowspan="2">Coeff.</th>
                  <th rowspan="2">Moyenne</th>
                  <th rowspan="2">Moy. Coeff.</th>
                  <th rowspan="2">Rang</th>
                  <th rowspan="2">Actions</th>
                </tr>
                <tr>
                  <th>Int. 1</th>
                  <th>Int. 2</th>
                  <th>Int. 3</th>
                  <th>Int. 4</th>
                  <th>Int. 5</th>
                  <th>Moy. Int.</th>
                  <th>Dev. 1</th>
                  <th>Dev. 2</th>
                  <th>Dev. 3</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(eleve, idx) in elevesWithNotes" :key="eleve.id" :class="{ 'female-row': eleve.sexe === 'F' }">
                  <td class="index-cell">{{ idx + 1 }}</td>
                  <td>{{ eleve.code }}</td>
                  <td :class="{ 'female-name': eleve.sexe === 'F' }">{{ eleve.nom }}</td>
                  <td :class="{ 'female-name': eleve.sexe === 'F' }">{{ eleve.prenom }}</td>
                  <td 
                    v-for="(note, index) in eleve.interrogations" 
                    :key="`int-${index}`" 
                    class="note-cell clickable"
                    @click="openEditNoteModal(eleve, 'Interrogation', index)"
                    title="Cliquer pour ajouter ou modifier"
                  >
                    {{ note !== null ? note : '—' }}
                  </td>
                  <td class="moyenne-cell" :class="{ 'no-data': eleve.moyenneInterrogations === null }">
                    {{ eleve.moyenneInterrogations !== null ? eleve.moyenneInterrogations : '—' }}
                  </td>
                  <td 
                    v-for="(note, index) in eleve.devoirs" 
                    :key="`dev-${index}`" 
                    class="note-cell clickable"
                    @click="openEditNoteModal(eleve, 'Devoir', index)"
                    title="Cliquer pour ajouter ou modifier"
                  >
                    {{ note !== null ? note : '—' }}
                  </td>
                  <td class="coeff-cell">{{ eleve.coefficient }}</td>
                  <td class="moyenne-cell" :class="{ 'no-data': eleve.moyenne === null }">
                    {{ eleve.moyenne !== null ? eleve.moyenne : '—' }}
                  </td>
                  <td class="moyenne-cell" :class="{ 'no-data': eleve.moyenneCoefficientee === null }">
                    {{ eleve.moyenneCoefficientee !== null ? eleve.moyenneCoefficientee : '—' }}
                  </td>
                  <td class="rang-cell" :class="{ 'no-data': eleve.rang === null || eleve.rang === undefined }">
                    {{ eleve.rang !== null && eleve.rang !== undefined ? eleve.rang : '—' }}
                  </td>
                  <td>
                    <button 
                      @click="openAddNoteModal(eleve)" 
                      class="btn-add-note"
                      title="Ajouter une note"
                    >
                      +
                    </button>
                  </td>
                </tr>
              </tbody>
              </table>
            </div>

            <button
              v-if="showScrollToggle"
              type="button"
              class="scroll-toggle-btn"
              @click="toggleScroll"
              :aria-label="isAtBottom ? 'Remonter en haut' : 'Descendre en bas'"
              :title="isAtBottom ? 'Remonter en haut' : 'Descendre en bas'"
            >
              {{ isAtBottom ? '↑' : '↓' }}
            </button>
          </div>
        </div>

        <!-- Vue Sélection Matière après sélection de Classe -->
        <div v-if="selectedClasse && !selectedMatiere" class="view">
          <div class="view-header">
            <button @click="goBackToClasses" class="btn-back">← Retour</button>
            <h2>Matières - {{ selectedClasse.nom }}</h2>
          </div>
          <div v-if="loadingMatieres" class="loading">Chargement...</div>
          <div v-else-if="matieresClasse.length === 0" class="empty">Aucune matière pour cette classe</div>
          <div v-else class="matieres-list">
            <div 
              v-for="matiere in matieresClasse" 
              :key="matiere.id"
              class="matiere-card"
              @click="selectMatiereForClasse(matiere)"
            >
              <div class="matiere-card-text">
                <h3>{{ matiere.nom }}</h3>
                <p>Classe : {{ selectedClasse.nom }}</p>
              </div>
              <button class="btn-icon">→</button>
            </div>
          </div>
        </div>

        <!-- Vue Matières (ancienne vue) -->
        <div v-if="activeView === 'matieres' && !selectedClasse" class="view">
          <h2>Mes Matières</h2>
          <div v-if="loading" class="loading">Chargement...</div>
          <div v-else-if="matieres.length === 0" class="empty">Aucune matière assignée</div>
          <div v-else class="matieres-list">
            <div 
              v-for="matiere in matieres" 
              :key="matiere.id"
              class="matiere-card"
            >
              <div class="matiere-card-text">
                <h3>{{ matiere.nom }}</h3>
                <p>{{ matiere.classe_nom }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ajout/Modification Note -->
    <div v-if="showAddNoteModal" class="modal-overlay" @click="closeAddNoteModal">
      <div class="modal" @click.stop>
        <h3>{{ editingNoteId ? 'Modifier la note' : 'Ajouter une note' }}</h3>
        <form @submit.prevent="saveNote">
          <div class="form-group">
            <label>Élève</label>
            <input 
              :value="selectedEleve ? `${selectedEleve.prenom} ${selectedEleve.nom}` : ''" 
              disabled
              class="input-disabled"
            />
          </div>
          <div class="form-group">
            <label>Matière <span class="required">*</span></label>
            <select v-model="noteForm.matiere_id" required>
              <option value="">Sélectionner une matière</option>
              <option 
                v-for="matiere in matieresDisponibles" 
                :key="matiere.id" 
                :value="matiere.id"
              >
                {{ matiere.nom }} ({{ matiere.classe_nom }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Trimestre <span class="required">*</span></label>
            <select v-model="noteForm.trimestre" required>
              <option :value="1">Trimestre 1</option>
              <option :value="2">Trimestre 2</option>
              <option :value="3">Trimestre 3</option>
            </select>
          </div>
          <div class="form-group">
            <label>Type <span class="required">*</span></label>
            <select v-model="noteForm.type" required>
              <option value="Interrogation">Interrogation</option>
              <option value="Devoir">Devoir</option>
              <option value="Examen">Examen</option>
            </select>
          </div>
          <div class="form-group">
            <label>Note (sur 20) <span class="required">*</span></label>
            <input 
              v-model.number="noteForm.valeur" 
              type="number" 
              min="0" 
              max="20" 
              step="0.5"
              required
              placeholder="Ex: 15.5"
            />
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeAddNoteModal" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-save" :disabled="savingNote">
              {{ savingNote ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import api from '../services/api'

export default {
  name: 'Professeur',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const user = ref(authStore.user)
    const activeView = ref('classes')
    const classes = ref([])
    const matieres = ref([])
    const selectedClasse = ref(null)
    const selectedMatiere = ref(null)
    const selectedTrimestre = ref(1)
    const elevesWithNotes = ref([])
    const matieresClasse = ref([])
    const loading = ref(false)
    const loadingEleves = ref(false)
    const loadingMatieres = ref(false)
    const sidebarOpen = ref(false)
    const showAddNoteModal = ref(false)
    const editingNoteId = ref(null)
    const selectedEleve = ref(null)
    const savingNote = ref(false)
    const mainContentRef = ref(null)
    const elevesTableRef = ref(null)
    const isAtBottom = ref(false)
    const canScroll = ref(false)
    const showScrollToggle = computed(
      () => !!selectedClasse.value && !!selectedMatiere.value && (elevesWithNotes.value?.length || 0) > 0 && canScroll.value
    )
    const noteForm = ref({
      eleve_id: '',
      matiere_id: '',
      trimestre: 1,
      type: 'Interrogation',
      valeur: ''
    })

    const getScrollContainer = () => mainContentRef.value || document.documentElement

    const updateScrollState = () => {
      const el = getScrollContainer()
      if (!el) return
      const scrollTop = el.scrollTop || 0
      const clientHeight = el.clientHeight || 0
      const scrollHeight = el.scrollHeight || 0
      canScroll.value = scrollHeight > clientHeight + 8
      isAtBottom.value = canScroll.value ? (scrollTop + clientHeight >= scrollHeight - 8) : false
    }

    const toggleScroll = () => {
      const el = getScrollContainer()
      if (!el) return
      const bottom = Math.max(0, (el.scrollHeight || 0) - (el.clientHeight || 0))
      el.scrollTo({ top: isAtBottom.value ? 0 : bottom, behavior: 'smooth' })
      window.setTimeout(updateScrollState, 250)
    }

    // Matières disponibles pour le professeur (filtrées par classe si une classe est sélectionnée)
    const matieresDisponibles = computed(() => {
      if (selectedClasse.value) {
        return matieres.value.filter(m => m.classe_id === selectedClasse.value.id)
      }
      return matieres.value
    })

    const loadClasses = async () => {
      loading.value = true
      try {
        const response = await api.get('/professeur/classes')
        classes.value = response.data
      } catch (error) {
        console.error('Erreur chargement classes:', error)
      } finally {
        loading.value = false
      }
    }

    const loadMatieres = async () => {
      loading.value = true
      try {
        const response = await api.get('/professeur/matieres')
        matieres.value = response.data
      } catch (error) {
        console.error('Erreur chargement matières:', error)
      } finally {
        loading.value = false
      }
    }

    const selectClasse = async (classe) => {
      selectedClasse.value = classe
      selectedMatiere.value = null
      loadingMatieres.value = true
      try {
        // Charger les matières de cette classe pour ce professeur
        const allMatieres = await api.get('/professeur/matieres')
        matieresClasse.value = allMatieres.data.filter(m => m.classe_id === classe.id)
      } catch (error) {
        console.error('Erreur chargement matières:', error)
      } finally {
        loadingMatieres.value = false
      }
    }

    const selectMatiereForClasse = async (matiere) => {
      selectedMatiere.value = matiere
      await loadElevesWithNotes()
    }

    const loadElevesWithNotes = async () => {
      if (!selectedClasse.value || !selectedMatiere.value) return

      loadingEleves.value = true
      try {
        const response = await api.get(
          `/professeur/classes/${selectedClasse.value.id}/matieres/${selectedMatiere.value.id}/trimestre/${selectedTrimestre.value}/eleves-notes`
        )
        elevesWithNotes.value = response.data
      } catch (error) {
        console.error('Erreur chargement élèves avec notes:', error)
        alert(error.response?.data?.message || 'Erreur lors du chargement des données')
      } finally {
        loadingEleves.value = false
      }
    }

    const openAddNoteModal = (eleve) => {
      editingNoteId.value = null
      selectedEleve.value = eleve
      noteForm.value = {
        eleve_id: eleve.id,
        matiere_id: selectedMatiere.value?.id || '',
        trimestre: selectedTrimestre.value,
        type: 'Interrogation',
        valeur: ''
      }
      showAddNoteModal.value = true
    }

    const openEditNoteModal = (eleve, type, index) => {
      const ids = type === 'Interrogation' ? (eleve.interrogationIds || []) : (eleve.devoirIds || [])
      const values = type === 'Interrogation' ? eleve.interrogations : eleve.devoirs
      const noteId = ids[index] || null
      const valeur = values && values[index] != null ? values[index] : ''
      selectedEleve.value = eleve
      editingNoteId.value = noteId
      noteForm.value = {
        eleve_id: eleve.id,
        matiere_id: selectedMatiere.value?.id || '',
        trimestre: selectedTrimestre.value,
        type,
        valeur
      }
      showAddNoteModal.value = true
    }

    const closeAddNoteModal = () => {
      showAddNoteModal.value = false
      editingNoteId.value = null
      selectedEleve.value = null
      noteForm.value = {
        eleve_id: '',
        matiere_id: '',
        trimestre: 1,
        type: 'Interrogation',
        valeur: ''
      }
    }

    const saveNote = async () => {
      if (!noteForm.value.matiere_id) {
        alert('Veuillez sélectionner une matière')
        return
      }

      savingNote.value = true
      try {
        if (editingNoteId.value) {
          await api.put(`/professeur/notes/${editingNoteId.value}`, {
            valeur: noteForm.value.valeur,
            type: noteForm.value.type,
            trimestre: noteForm.value.trimestre
          })
        } else {
          await api.post('/professeur/notes', noteForm.value)
        }
        closeAddNoteModal()
        await loadElevesWithNotes()
      } catch (error) {
        alert(error.response?.data?.message || 'Erreur lors de l\'enregistrement de la note')
      } finally {
        savingNote.value = false
      }
    }

    const goBackToClasses = () => {
      selectedClasse.value = null
      selectedMatiere.value = null
      activeView.value = 'classes'
    }

    const goBackToClasse = () => {
      selectedMatiere.value = null
    }

    const goToClasses = () => {
      activeView.value = 'classes'
      selectedClasse.value = null
      selectedMatiere.value = null
    }

    const goToMatieres = () => {
      activeView.value = 'matieres'
      selectedClasse.value = null
      selectedMatiere.value = null
    }

    const logout = () => {
      authStore.logout()
      router.push('/')
    }

    onMounted(async () => {
      if (!authStore.isAuthenticated || !authStore.isProfesseur) {
        router.push('/')
        return
      }
      await Promise.all([loadClasses(), loadMatieres()])
      await nextTick()
      updateScrollState()
      if (mainContentRef.value) {
        mainContentRef.value.addEventListener('scroll', updateScrollState, { passive: true })
      }
      window.addEventListener('resize', updateScrollState)
    })

    onUnmounted(() => {
      if (mainContentRef.value) {
        mainContentRef.value.removeEventListener('scroll', updateScrollState)
      }
      window.removeEventListener('resize', updateScrollState)
    })

    watch([elevesWithNotes, selectedClasse, selectedMatiere, selectedTrimestre], async () => {
      await nextTick()
      updateScrollState()
    })

    return {
      user,
      sidebarOpen,
      activeView,
      classes,
      matieres,
      selectedClasse,
      selectedMatiere,
      selectedTrimestre,
      elevesWithNotes,
      matieresClasse,
      loading,
      loadingEleves,
      loadingMatieres,
      showAddNoteModal,
      editingNoteId,
      selectedEleve,
      savingNote,
      mainContentRef,
      elevesTableRef,
      isAtBottom,
      canScroll,
      showScrollToggle,
      toggleScroll,
      noteForm,
      matieresDisponibles,
      selectClasse,
      selectMatiereForClasse,
      loadElevesWithNotes,
      openAddNoteModal,
      openEditNoteModal,
      closeAddNoteModal,
      saveNote,
      goBackToClasses,
      goBackToClasse,
      goToClasses,
      goToMatieres,
      logout
    }
  }
}
</script>

<style scoped>
.professeur-container {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
}

.prof-bg-video {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  opacity: 0.26;
  pointer-events: none;
}

.header {
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--primary-500, #1e88e5) 0%, var(--primary-600, #1565c0) 60%, var(--primary-700, #0d47a1) 100%);
  padding: 24px 40px 28px;
  min-height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 28px rgba(13, 71, 161, 0.18);
  gap: 16px;
  position: relative;
  z-index: 1;
}

.btn-menu-mobile {
  display: none;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: #3498db;
  color: white;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn-menu-mobile svg {
  display: block;
}

.header-title {
  flex: 1;
  margin: 0;
  font-size: 1.25rem;
  color: white;
  font-weight: 900;
  text-shadow: 0 1px 0 rgba(0,0,0,0.08);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info span {
  color: white;
  font-weight: 800;
}

.btn-logout {
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 800;
  transition: transform 0.15s ease, background 0.25s ease;
}

.content {
  flex: 1;
  display: flex;
  min-height: 0;
  padding: 20px;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar-overlay.visible {
  opacity: 1;
}

.sidebar {
  width: 260px;
  flex-shrink: 0;
  align-self: stretch;
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .btn-menu-mobile {
    display: flex;
  }

  .header {
    padding: 16px 20px;
  }

  .sidebar-overlay {
    display: block;
  }

  .sidebar-overlay.visible {
    pointer-events: auto;
  }

  .sidebar-overlay:not(.visible) {
    pointer-events: none;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 101;
    width: 260px;
    max-width: 85vw;
    border-radius: 0;
    transform: translateX(-100%);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .content {
    padding: 12px;
  }
}

.nav-btn {
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  font-size: 16px;
  transition: all 0.3s;
  font-weight: 500;
}

.nav-btn.active {
  background: #3498db;
  color: white;
}

.nav-btn:hover {
  background: #e0e0e0;
}

.nav-btn.active:hover {
  background: #2980b9;
}

.main-content {
  flex: 1;
  min-width: 0;
  background: white;
  border-radius: 12px;
  padding: 30px;
  overflow: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: relative;
  z-index: 1;
}

.view h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
}

.view-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.header-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.filters {
  display: flex;
  align-items: center;
  gap: 10px;
}

.select-trimestre {
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.btn-back {
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.classe-card {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  padding: 25px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.classe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.classe-card h3 {
  font-size: 20px;
  margin-bottom: 8px;
}

.matieres-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(260px, 1fr)); /* 3 cards par ligne sur desktop */
  gap: 24px;
  max-width: 1200px;
  margin: 24px auto 0;
}

.matiere-card {
  background: #ffffff;
  padding: 22px 20px;
  border-radius: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.10);
  border: 1px solid rgba(226, 232, 240, 0.9);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.matiere-card-text {
  position: relative;
  padding-left: 16px;
}

.matiere-card-text::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--primary-500);
  border-radius: 999px;
}

.matiere-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
  border-color: rgba(37, 99, 235, 0.35);
}

.btn-icon {
  background: var(--primary-600);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 1024px) {
  .matieres-list {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
}

@media (max-width: 640px) {
  .matieres-list {
    grid-template-columns: 1fr;
  }
}

.table-container {
  overflow-x: auto;
  margin-top: 20px;
  position: relative;
  padding-bottom: 6px;
}

.table-shell {
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.10);
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.10);
}

.notes-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background: white;
}

.notes-table thead {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  color: white;
}

.notes-table th {
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  border: 1px solid rgba(255,255,255,0.18);
}

.index-col {
  width: 56px;
}

.index-cell {
  font-weight: 600;
  color: #1f2937;
}

.female-name {
  color: #dc2626;
  font-weight: inherit;
}

.female-row td {
  color: #dc2626;
}

.female-row {
  background: rgba(220, 38, 38, 0.06);
}

.scroll-toggle-btn {
  position: fixed;
  right: 18px;
  bottom: 18px;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  color: white;
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 14px 30px rgba(13, 71, 161, 0.28);
  z-index: 50;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;
}

.scroll-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 40px rgba(13, 71, 161, 0.35);
  filter: brightness(1.05);
}

.scroll-toggle-btn:active {
  transform: translateY(0);
  box-shadow: 0 12px 24px rgba(13, 71, 161, 0.25);
}

.section-header {
  background: #2980b9 !important;
  font-weight: 700;
}

.notes-table td {
  padding: 10px 8px;
  text-align: center;
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.notes-table tbody tr:hover {
  background: rgba(30, 136, 229, 0.06);
}

.notes-table tbody tr:nth-child(even) {
  background: #fafafa;
}

.notes-table tbody tr:nth-child(even):hover {
  background: rgba(30, 136, 229, 0.10);
}

.note-cell {
  min-width: 60px;
  font-weight: 500;
  color: #333;
}
.note-cell.clickable {
  cursor: pointer;
}
.note-cell:empty::before {
  content: '—';
  color: #999;
}

.coeff-cell {
  font-weight: 600;
  color: #3498db;
}

.moyenne-cell {
  font-weight: 700;
  font-size: 15px;
  color: #28a745;
}

.moyenne-cell.no-data {
  color: #999;
  font-weight: 400;
}

.rang-cell {
  font-weight: 700;
  font-size: 15px;
  color: var(--primary-700);
  min-width: 56px;
}

.rang-cell.no-data {
  color: #999;
  font-weight: 400;
}

.btn-add-note {
  padding: 6px 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.btn-add-note:hover {
  background: #218838;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

.modal h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 22px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.required {
  color: #dc3545;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3498db;
}

.input-disabled {
  background: #f5f5f5;
  color: #666;
  cursor: not-allowed;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 25px;
}

.btn-cancel {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-save {
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-save:hover:not(:disabled) {
  background: #218838;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading, .empty {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}
</style>
