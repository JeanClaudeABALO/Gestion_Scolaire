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

    <!-- Hero Section (vidéo d'animation en fond + texte par-dessus) -->
    <section class="hero">
      <div class="hero-bg">
        <video
          class="hero-video"
          autoplay
          muted
          loop
          playsinline
          src="/vidéo1.webm"
        />
      </div>
      <div class="hero-content">
        <h2 class="hero-title-anim">BIENVENU DANS LE SYSTÈME DE<br />GESTION SCOLAIRE MODERNE ET EFFICACE</h2>
        <p class="hero-subtitle hero-subtitle-anim">Centralisez vos notes, suivez la progression de vos élèves et facilitez la communication avec les parents</p>
      </div>
    </section>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Section 1: Présentation du système (image à gauche + 3 cards à droite) -->
      <section class="session session--presentation">
        <p class="session-label">PRÉSENTATION</p>
        <h2 class="session-title">Qu’est-ce que notre système de gestion scolaire ?</h2>
        <p class="session-desc">Découvrez une plateforme conçue pour simplifier la gestion académique de votre établissement et faciliter la collaboration entre enseignants, administration et parents.</p>
        <div class="presentation-layout">
          <div class="presentation-media">
            <img class="presentation-image" src="/session-presentation-bg.jpg" alt="Présentation du système" />
          </div>

          <div class="presentation-cards">
            <div class="card">
              <div class="card-icon-wrap card-icon-wrap--blue">
                <Icon name="book" :size="32" class="card-icon" />
              </div>
              <h3 class="card-title">Une plateforme centralisée</h3>
              <p class="card-text">Centralisez les classes, matières et notes au même endroit, avec une navigation simple et rapide.</p>
            </div>

            <div class="card">
              <div class="card-icon-wrap card-icon-wrap--green">
                <Icon name="trending" :size="32" class="card-icon" />
              </div>
              <h3 class="card-title">Suivi par trimestre</h3>
              <p class="card-text">Suivez la progression des élèves par trimestre avec des notes structurées et des moyennes calculées.</p>
            </div>

            <div class="card">
              <div class="card-icon-wrap card-icon-wrap--purple">
                <Icon name="lock" :size="32" class="card-icon" />
              </div>
              <h3 class="card-title">Accès sécurisé</h3>
              <p class="card-text">Accès par codes (professeur/admin/parent) et séparation claire des droits pour une utilisation sereine.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 2: Fonctionnalités clés -->
      <section class="session session--alt session--bg session--bg-features">
        <p class="session-label">FONCTIONNALITÉS</p>
        <h2 class="session-title">Fonctionnalités clés</h2>
        <p class="session-desc">Tout ce dont vous avez besoin pour gérer les notes, les classes et le suivi des élèves en un seul endroit.</p>
        <div class="session-cards">
          <div class="card">
            <div class="card-icon-wrap card-icon-wrap--blue">
              <Icon name="chart" :size="32" class="card-icon" />
            </div>
            <h3 class="card-title">Gestion des Classes et Matières</h3>
            <p class="card-text">Organisez facilement vos classes et matières. Chaque professeur peut voir ses classes assignées et gérer ses matières.</p>
          </div>
          <div class="card">
            <div class="card-icon-wrap card-icon-wrap--green">
              <Icon name="edit" :size="32" class="card-icon" />
            </div>
            <h3 class="card-title">Saisie et Suivi des Notes</h3>
            <p class="card-text">Les professeurs peuvent saisir les notes par trimestre, avec distinction entre interrogations et devoirs. Calcul automatique des moyennes.</p>
          </div>
          <div class="card">
            <div class="card-icon-wrap card-icon-wrap--purple">
              <Icon name="trending" :size="32" class="card-icon" />
            </div>
            <h3 class="card-title">Calcul Automatique des Moyennes</h3>
            <p class="card-text">Le système calcule automatiquement les moyennes par matière, par trimestre, et les moyennes générales avec coefficients.</p>
          </div>
          <div class="card">
            <div class="card-icon-wrap card-icon-wrap--blue">
              <Icon name="lock" :size="32" class="card-icon" />
            </div>
            <h3 class="card-title">Accès Sécurisé pour les Parents</h3>
            <p class="card-text">Chaque parent dispose d'un code secret unique pour accéder aux informations et notes de son enfant en toute sécurité.</p>
          </div>
          <div class="card">
            <div class="card-icon-wrap card-icon-wrap--green">
              <Icon name="admin" :size="32" class="card-icon" />
            </div>
            <h3 class="card-title">Tableau de Bord Administrateur</h3>
            <p class="card-text">Le responsable pédagogique a une vue d'ensemble complète : professeurs, élèves, classes et toutes les notes.</p>
          </div>
          <div class="card">
            <div class="card-icon-wrap card-icon-wrap--purple">
              <Icon name="upload" :size="32" class="card-icon" />
            </div>
            <h3 class="card-title">Import d'Élèves</h3>
            <p class="card-text">Importation rapide des élèves via fichiers Excel ou Word. Génération automatique des codes secrets pour les parents.</p>
          </div>
        </div>
      </section>

      <!-- Section 3: Profils utilisateurs -->
      <section class="session session--bg session--bg-profiles">
        <p class="session-label">PROFILS UTILISATEURS</p>
        <h2 class="session-title">Qui peut utiliser le système ?</h2>
        <p class="session-desc">Trois types d'accès adaptés aux professeurs, aux responsables pédagogiques et aux parents d'élèves.</p>
        <div class="session-cards">
          <div class="card">
            <div class="card-icon-wrap card-icon-wrap--blue">
              <Icon name="teacher" :size="32" class="card-icon" />
            </div>
            <h3 class="card-title">Professeur</h3>
            <p class="card-text"><strong>Accès :</strong> Code personnel unique.</p>
            <p class="card-text">Consulter ses classes et matières, saisir et modifier les notes, voir les moyennes par trimestre, gérer les évaluations (interrogations, devoirs).</p>
          </div>
          <div class="card">
            <div class="card-icon-wrap card-icon-wrap--green">
              <Icon name="admin" :size="32" class="card-icon" />
            </div>
            <h3 class="card-title">Responsable Pédagogique</h3>
            <p class="card-text"><strong>Accès :</strong> Code personnel (rôle administrateur).</p>
            <p class="card-text">Toutes les fonctionnalités du professeur, vue d'ensemble des professeurs et élèves, gestion des classes, consultation de toutes les notes, import d'élèves, réinitialisation des codes.</p>
          </div>
          <div class="card">
            <div class="card-icon-wrap card-icon-wrap--purple">
              <span class="card-emoji">👨‍👩‍👧</span>
            </div>
            <h3 class="card-title">Parent d'Élève</h3>
            <p class="card-text"><strong>Accès :</strong> Code secret de l'élève.</p>
            <p class="card-text">Consulter les informations et toutes les notes de l'élève, suivre les moyennes par trimestre, accéder à l'historique des évaluations. Accès en lecture seule.</p>
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
    return {}
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
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 60%, var(--primary-700) 100%);
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
  font-size: 2rem;
  font-weight: 800;
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
  font-weight: 700;
  font-size: 16px;
  transition: all 0.3s;
}

.btn-nav:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.btn-nav.btn-primary {
  background: white;
  color: var(--primary-600);
  border-color: white;
}

.btn-nav.btn-primary:hover {
  background: #f0f0ff;
  color: var(--primary-700);
  transform: translateY(-2px);
}

/* Hero Section - pleine largeur, hauteur réduite */
.hero {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  background-color: #e8eaf0;
  padding: 56px 24px;
  text-align: center;
  min-height: 58vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0.75;
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 100%;
  padding: 0 1rem;
  margin: 0 auto;
  box-sizing: border-box;
}

/* Animation d'entrée du texte hero */
@keyframes heroFadeUp {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero h2.hero-title-anim {
  font-size: 2.75rem;
  margin-bottom: 20px;
  font-weight: 800;
  color: var(--primary-700);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
  animation: heroFadeUp 0.9s ease-out forwards;
  opacity: 0;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.hero-subtitle {
  font-size: 1.3rem;
  line-height: 1.6;
  color: var(--primary-600);
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.hero-subtitle-anim {
  animation: heroFadeUp 0.9s ease-out 0.25s forwards;
  opacity: 0;
}

/* Main Content */
.main-content {
  flex: 1;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 60px 0;
  box-sizing: border-box;
}

/* Session = bloc avec petit titre, titre principal, description, puis cartes */
.session {
  margin-bottom: 72px;
  padding: 56px 24px;
  text-align: center;
}

.session--bg {
  position: relative;
  overflow: hidden;
}

.session--bg > * {
  position: relative;
  z-index: 1;
}
.session--bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  opacity: 0.45; /* moins transparent (fond plus visible) */
  z-index: 0;    /* au-dessus du fond de la section */
}

.session--bg-presentation::before {
  background-image: url('/session-presentation-bg.jpg');
}

.session--bg-features::before {
  background-image: url('/session-features-bg.jpg');
}

.session--bg-profiles::before {
  background-image: url('/session-profiles-bg.jpg');
}

.session--presentation {
  /* pas de fond image ici : on utilise une image à gauche dans le layout */
}

.presentation-layout {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 28px;
  align-items: center;
  text-align: left;
  max-width: 1200px;
  margin: 0 auto;
}

.presentation-media {
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 34px rgba(0, 0, 0, 0.10);
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: white;
  height: 100%;
  min-height: 280px;
}

.presentation-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.presentation-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}

.session--alt {
  background: rgba(248, 249, 250, 0.9); /* légèrement translucide */
  border-radius: 16px;
  margin: 48px 0;
}

.session-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 0 0 16px 0;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--primary-500);
}

.session-label::before,
.session-label::after {
  content: '';
  display: inline-block;
  width: 40px;
  height: 2px;
  background: var(--primary-500);
}

.session-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 0 0 16px 0;
  line-height: 1.25;
}

.session-desc {
  font-size: 1.15rem;
  color: #5a6c7d;
  max-width: 640px;
  margin: 0 auto 40px auto;
  line-height: 1.65;
}

.session-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(260px, 1fr)); /* 3 cards par ligne sur desktop */
  gap: 24px;
  text-align: left;
}

/* Session Fonctionnalités : cards un peu plus compactes */
.session--bg-features .card {
  padding: 28px 20px;
  border-radius: 14px;
  min-height: 210px;
}

.session--bg-features .card-icon-wrap {
  width: 52px;
  height: 52px;
  margin-bottom: 16px;
}

.session--bg-features .card-title {
  font-size: 1.25rem;
  margin-bottom: 10px;
}

.session--bg-features .card-text {
  font-size: 0.98rem;
}

/* Fonctionnalités : un peu moins large (colonnes plus “serrées”) */
.session--bg-features .session-cards {
  grid-template-columns: repeat(3, minmax(0, 320px)); /* cards moins larges */
  justify-content: center; /* centre les 3 colonnes */
}

/* Session Profils : cards un peu plus étroites */
.session--bg-profiles .session-cards {
  grid-template-columns: repeat(3, minmax(260px, 1fr));
  max-width: 1200px;
  margin: 0 auto;
}

.session--bg-profiles .card {
  padding: 30px 26px;
}

.session--bg-profiles .card-icon-wrap {
  width: 60px;
  height: 60px;
  margin-bottom: 22px;
}

.session--bg-profiles .card-title {
  font-size: 1.45rem;
}

.session--bg-profiles .card-text {
  font-size: 1.08rem;
}

.session-cards--single {
  grid-template-columns: 1fr;
  max-width: 980px;
  margin: 0 auto;
}

/* Cards style type WabaJob */
.card {
  background: white;
  border-radius: 16px;
  padding: 28px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s, box-shadow 0.25s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.card--large {
  padding: 44px 48px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(52, 152, 219, 0.12), 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(52, 152, 219, 0.15);
  background: linear-gradient(145deg, #ffffff 0%, #f8fbff 100%);
  position: relative;
  overflow: hidden;
}

.card--large::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3498db 0%, #5dade2 50%, #85c1e9 100%);
  border-radius: 20px 20px 0 0;
}

.card--large:hover {
  box-shadow: 0 12px 40px rgba(52, 152, 219, 0.18), 0 4px 16px rgba(0, 0, 0, 0.08);
}

.card--large .card-icon-wrap {
  width: 64px;
  height: 64px;
  margin-bottom: 24px;
}

.card--large .card-title {
  font-size: 1.5rem;
  margin-bottom: 16px;
}

.card--large .card-text,
.card--large .card-list {
  font-size: 1.08rem;
}

.card--large .card-highlight {
  padding: 20px 22px;
  font-size: 1.08rem;
  border-radius: 12px;
}

.card-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.card-icon-wrap--blue {
  background: var(--primary-500);
  color: white;
}

.card-icon-wrap--green {
  background: #27ae60;
  color: white;
}

.card-icon-wrap--purple {
  background: #8e44ad;
  color: white;
}

.card-icon {
  display: block;
}

.card-emoji {
  font-size: 30px;
}

.card-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.card-text {
  font-size: 1.05rem;
  color: #5a6c7d;
  line-height: 1.6;
  margin: 0 0 10px 0;
}

.card-text strong {
  font-weight: 800;
}

.card-text:last-of-type {
  margin-bottom: 0;
}

.card-list {
  margin: 12px 0 16px 0;
  padding-left: 22px;
  color: #5a6c7d;
  font-size: 1.05rem;
  line-height: 1.7;
}

.card-list li {
  margin-bottom: 6px;
}

.card-highlight {
  background: #e8f4fc;
  padding: 16px 18px;
  border-radius: 10px;
  border-left: 4px solid var(--primary-500);
  margin: 20px 0 0 0;
  font-weight: 700;
  color: #2c3e50;
  font-size: 1.05rem;
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
  font-size: 1.05rem;
}

.footer-subtitle {
  opacity: 0.8;
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
    padding: 15px 20px;
  }

  .hero {
    padding: 40px 16px;
    min-height: 48vh;
  }

  .hero-bg .hero-video {
    object-fit: cover;
  }

  .hero h2 {
    font-size: 2rem;
    margin-bottom: 12px;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .main-content {
    padding: 40px 16px;
  }

  .session-label::before,
  .session-label::after {
    width: 24px;
  }

  .session-title {
    font-size: 1.75rem;
  }

  .session-desc {
    font-size: 1.08rem;
    margin-bottom: 28px;
  }

  .session-cards {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .presentation-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .session--alt {
    padding: 32px 16px;
  }

  .card {
    padding: 24px 20px;
  }

  .card--large {
    padding: 32px 24px;
  }

  .session-cards--single {
    max-width: 100%;
  }
}
</style>
