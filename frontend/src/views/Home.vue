<template>
  <div class="home-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <Icon name="book" :size="28" class="logo-icon-inline" />
          <h1>Système de Gestion Scolaire</h1>
        </div>
        <nav class="header-nav">
          <router-link to="/login" class="btn-nav">Connexion</router-link>
          <router-link to="/inscription" class="btn-nav btn-primary">Inscription</router-link>
        </nav>
      </div>
    </header>

    <!-- Hero Section (image de fond avec opacité + texte par-dessus) -->
    <section class="hero">
      <div class="hero-bg" :style="heroStyle"></div>
      <div class="hero-content">
        <h2>Gestion Scolaire Moderne et Efficace</h2>
        <p class="hero-subtitle">Centralisez vos notes, suivez la progression de vos élèves et facilitez la communication avec les parents</p>
      </div>
    </section>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Section 1: Présentation générale -->
      <section class="section">
        <div class="section-content">
          <h3>Présentation du Système</h3>
          <div class="section-text">
            <p>
              Notre système de gestion scolaire est une plateforme complète conçue pour simplifier 
              la gestion académique de votre établissement. Il offre une solution centralisée pour 
              la gestion des notes, le suivi des élèves et la communication avec les familles.
            </p>
            <p>
              <strong>Objectifs principaux :</strong>
            </p>
            <ul class="objectives-list">
              <li>Centralisation des notes et évaluations</li>
              <li>Suivi académique détaillé des élèves par trimestre</li>
              <li>Collaboration efficace entre enseignants, administration et parents</li>
              <li>Calcul automatique des moyennes et statistiques</li>
            </ul>
            <p class="highlight">
              Un système simple, fiable et sécurisé pour une gestion scolaire professionnelle.
            </p>
          </div>
        </div>
      </section>

      <!-- Section 2: Fonctionnalités clés -->
      <section class="section section-alt">
        <div class="section-content">
          <h3>Fonctionnalités Clés</h3>
          <div class="features-grid">
            <div class="feature-card">
              <Icon name="chart" :size="48" class="feature-icon" />
              <h4>Gestion des Classes et Matières</h4>
              <p>Organisez facilement vos classes et matières. Chaque professeur peut voir ses classes assignées et gérer ses matières.</p>
            </div>
            <div class="feature-card">
              <Icon name="edit" :size="48" class="feature-icon" />
              <h4>Saisie et Suivi des Notes</h4>
              <p>Les professeurs peuvent saisir les notes par trimestre, avec distinction entre interrogations et devoirs. Calcul automatique des moyennes.</p>
            </div>
            <div class="feature-card">
              <Icon name="trending" :size="48" class="feature-icon" />
              <h4>Calcul Automatique des Moyennes</h4>
              <p>Le système calcule automatiquement les moyennes par matière, par trimestre, et les moyennes générales avec coefficients.</p>
            </div>
            <div class="feature-card">
              <Icon name="lock" :size="48" class="feature-icon" />
              <h4>Accès Sécurisé pour les Parents</h4>
              <p>Chaque parent dispose d'un code secret unique pour accéder aux informations et notes de son enfant en toute sécurité.</p>
            </div>
            <div class="feature-card">
              <Icon name="admin" :size="48" class="feature-icon" />
              <h4>Tableau de Bord Administrateur</h4>
              <p>Le responsable pédagogique a une vue d'ensemble complète : professeurs, élèves, classes et toutes les notes.</p>
            </div>
            <div class="feature-card">
              <Icon name="upload" :size="48" class="feature-icon" />
              <h4>Import d'Élèves</h4>
              <p>Importation rapide des élèves via fichiers Excel ou Word. Génération automatique des codes secrets pour les parents.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 3: Profils utilisateurs -->
      <section class="section">
        <div class="section-content">
          <h3>Profils Utilisateurs</h3>
          <div class="profiles-grid">
            <div class="profile-card">
              <div class="profile-header">
                <Icon name="teacher" :size="40" class="profile-icon" />
                <h4>Professeur</h4>
              </div>
              <div class="profile-content">
                <p><strong>Accès :</strong> Code personnel unique</p>
                <p><strong>Fonctionnalités :</strong></p>
                <ul>
                  <li>Consulter ses classes et matières</li>
                  <li>Saisir et modifier les notes de ses élèves</li>
                  <li>Voir les moyennes par trimestre</li>
                  <li>Gérer les évaluations (interrogations, devoirs)</li>
                </ul>
              </div>
            </div>

            <div class="profile-card profile-admin">
              <div class="profile-header">
                <Icon name="admin" :size="40" class="profile-icon" />
                <h4>Responsable Pédagogique</h4>
              </div>
              <div class="profile-content">
                <p><strong>Accès :</strong> Code personnel unique (rôle administrateur)</p>
                <p><strong>Fonctionnalités :</strong></p>
                <ul>
                  <li>Toutes les fonctionnalités du professeur</li>
                  <li>Vue d'ensemble de tous les professeurs</li>
                  <li>Gestion de tous les élèves et classes</li>
                  <li>Consultation de toutes les notes</li>
                  <li>Import d'élèves via fichiers</li>
                  <li>Réinitialisation des codes d'accès</li>
                </ul>
              </div>
            </div>

            <div class="profile-card">
              <div class="profile-header">
                <div class="profile-icon">👨‍👩‍👧</div>
                <h4>Parent d'Élève</h4>
              </div>
              <div class="profile-content">
                <p><strong>Accès :</strong> Code secret de l'élève</p>
                <p><strong>Fonctionnalités :</strong></p>
                <ul>
                  <li>Consulter les informations de l'élève</li>
                  <li>Voir toutes les notes par matière</li>
                  <li>Suivre les moyennes par trimestre</li>
                  <li>Accéder à l'historique des évaluations</li>
                </ul>
                <p class="note"><em>Accès en lecture seule - Aucune modification possible</em></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Système de Gestion Scolaire. Tous droits réservés.</p>
        <p class="footer-subtitle">Solution professionnelle pour la gestion académique</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import Icon from '../components/Icons.vue'

export default {
  name: 'Home',
  components: {
    Icon
  },
  setup() {
    const router = useRouter()

    // Image de fond de la section hero (remplacez par le chemin de votre image si besoin)
    const heroBgImage = '/hero-bg.jpg.jpg'
    const heroStyle = {
      backgroundImage: `url(${heroBgImage})`
    }

    return {
      heroStyle
    }
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
}

/* Header - première partie en bleu */
.header {
  background: linear-gradient(135deg, #5dade2 0%, #3498db 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon-inline {
  color: white;
}

.logo h1 {
  margin: 0;
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
}

.header-nav {
  display: flex;
  gap: 15px;
}

.header-nav a {
  text-decoration: none;
}

.btn-nav {
  padding: 10px 24px;
  border: 2px solid rgba(255, 255, 255, 0.9);
  background: transparent;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s;
}

.btn-nav:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.btn-nav.btn-primary {
  background: white;
  color: #3498db;
  border-color: white;
}

.btn-nav.btn-primary:hover {
  background: #f0f0ff;
  color: #2980b9;
  transform: translateY(-2px);
}

/* Hero Section - image de fond avec opacité */
.hero {
  position: relative;
  background-color: #a8b4d4;
  color: white;
  padding: 80px 40px;
  text-align: center;
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.75;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.95;
  line-height: 1.6;
}

/* Main Content */
.main-content {
  flex: 1;
  width: 100%;
  margin: 0 auto;
  padding: 60px 40px;
  box-sizing: border-box;
}

.section {
  margin-bottom: 60px;
}

.section-alt {
  background: #f8f9fa;
  padding: 50px 40px;
  border-radius: 16px;
  margin: 40px 0;
}

.section-content h3 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 700;
}

.section-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  max-width: 900px;
  margin: 0 auto;
}

.section-text p {
  margin-bottom: 15px;
}

.objectives-list {
  margin: 20px 0;
  padding-left: 30px;
}

.objectives-list li {
  margin-bottom: 10px;
  color: #444;
}

.highlight {
  background: #e8f0fe;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #3498db;
  margin-top: 25px;
  font-weight: 500;
  color: #333;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.feature-card h4 {
  color: #3498db;
  margin-bottom: 12px;
  font-size: 1.3rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* Profiles Grid */
.profiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  transition: transform 0.3s, box-shadow 0.3s;
}

.profile-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.profile-admin {
  border-top-color: #2980b9;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.profile-icon {
  font-size: 2.5rem;
}

.profile-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.4rem;
}

.profile-content {
  color: #555;
  line-height: 1.8;
}

.profile-content p {
  margin-bottom: 12px;
}

.profile-content ul {
  margin: 15px 0;
  padding-left: 25px;
}

.profile-content li {
  margin-bottom: 8px;
  color: #444;
}

.note {
  margin-top: 15px;
  padding: 12px;
  background: #fff3cd;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #856404;
}

/* Footer */
.footer {
  background: #2c3e50;
  color: white;
  padding: 30px 40px;
  text-align: center;
  margin-top: 60px;
}

.footer-content p {
  margin: 8px 0;
}

.footer-subtitle {
  opacity: 0.8;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
    padding: 15px 20px;
  }

  .hero {
    padding: 40px 20px;
    min-height: 260px;
  }

  .hero-bg {
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .hero h2 {
    font-size: 1.8rem;
    margin-bottom: 12px;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .main-content {
    padding: 40px 20px;
  }

  .features-grid,
  .profiles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
