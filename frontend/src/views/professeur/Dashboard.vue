<template>
  <div class="dashboard">
    <nav class="navbar">
      <h2>Espace Professeur</h2>
      <div class="user-info">
        <span>{{ user.prenom }} {{ user.nom }}</span>
        <button @click="logout" class="btn-logout">Déconnexion</button>
      </div>
    </nav>

    <div class="container">
      <div class="sidebar">
        <router-link to="/professeur" class="nav-item">Tableau de bord</router-link>
        <router-link to="/professeur/classes" class="nav-item">Mes Classes</router-link>
        <router-link to="/professeur/matieres" class="nav-item">Mes Matières</router-link>
      </div>

      <div class="content">
        <h1>Bienvenue, {{ user.prenom }} {{ user.nom }}</h1>
        
        <div class="stats-grid">
          <div class="stat-card">
            <h3>{{ classes.length }}</h3>
            <p>Classes</p>
          </div>
          <div class="stat-card">
            <h3>{{ matieres.length }}</h3>
            <p>Matières</p>
          </div>
        </div>

        <div class="section">
          <h2>Mes Classes</h2>
          <div v-if="loading" class="loading">Chargement...</div>
          <div v-else-if="classes.length === 0" class="empty">Aucune classe assignée</div>
          <div v-else class="classes-list">
            <div v-for="classe in classes" :key="classe.id" class="classe-card">
              <h3>{{ classe.nom }}</h3>
              <p>{{ classe.filiere_nom }}</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Mes Matières</h2>
          <div v-if="loading" class="loading">Chargement...</div>
          <div v-else-if="matieres.length === 0" class="empty">Aucune matière assignée</div>
          <div v-else class="matieres-list">
            <div v-for="matiere in matieres" :key="matiere.id" class="matiere-card">
              <h3>{{ matiere.nom }}</h3>
              <p>Classe: {{ matiere.classe_nom }}</p>
              <router-link :to="`/professeur/notes/${matiere.id}`" class="btn-link">
                Gérer les notes
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'ProfesseurDashboard',
  setup() {
    const store = useStore()
    const router = useRouter()
    const user = store.getters.currentUser
    const classes = ref([])
    const matieres = ref([])
    const loading = ref(true)

    const loadData = async () => {
      try {
        loading.value = true
        const [classesRes, matieresRes] = await Promise.all([
          axios.get('/professeur/classes'),
          axios.get('/professeur/matieres')
        ])
        classes.value = classesRes.data
        matieres.value = matieresRes.data
      } catch (error) {
        console.error('Erreur chargement données:', error)
      } finally {
        loading.value = false
      }
    }

    const logout = () => {
      store.dispatch('logout')
      router.push('/')
    }

    onMounted(() => {
      loadData()
    })

    return {
      user,
      classes,
      matieres,
      loading,
      logout
    }
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f5f5;
}

.navbar {
  background: white;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-logout {
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  gap: 20px;
}

.sidebar {
  width: 250px;
  background: white;
  border-radius: 10px;
  padding: 20px;
  height: fit-content;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-item {
  display: block;
  padding: 12px;
  margin-bottom: 8px;
  text-decoration: none;
  color: #333;
  border-radius: 6px;
  transition: all 0.3s;
}

.nav-item:hover,
.nav-item.router-link-active {
  background: #3498db;
  color: white;
}

.content {
  flex: 1;
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.stat-card {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
}

.stat-card h3 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.section {
  margin-top: 40px;
}

.classes-list,
.matieres-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.classe-card,
.matiere-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.btn-link {
  display: inline-block;
  margin-top: 10px;
  padding: 8px 16px;
  background: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
}

.loading,
.empty {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>
