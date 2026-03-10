<template>
  <div class="responsable-container">
    <header class="header">
      <button type="button" class="btn-menu-mobile" aria-label="Menu" @click="sidebarOpen = !sidebarOpen">
        <Icon name="menu" :size="24" />
      </button>
      <h1 class="header-title">Espace Responsable</h1>
      <div class="user-info">
        <span v-if="user">{{ user.prenom }} {{ user.nom }}</span>
        <span v-else>Chargement...</span>
        <button @click="logout" class="btn-logout">Déconnexion</button>
      </div>
    </header>

    <div class="sidebar-overlay" :class="{ visible: sidebarOpen }" @click="sidebarOpen = false" aria-hidden="true"></div>
    <div class="content">
      <div class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
        <nav>
          <button 
            :class="['nav-btn', { active: activeView === 'mes-classes' }]"
            @click="(goToMesClasses(), sidebarOpen = false)"
          >
            Mes Classes
          </button>
          <button 
            :class="['nav-btn', { active: activeView === 'professeurs' }]"
            @click="setViewAndClose('professeurs')"
          >
            Professeurs
          </button>
          <button 
            :class="['nav-btn', { active: activeView === 'eleves' }]"
            @click="setViewAndClose('eleves')"
          >
            Élèves
          </button>
          <button 
            :class="['nav-btn', { active: activeView === 'matieres' }]"
            @click="setViewAndClose('matieres')"
          >
            Matières
          </button>
          <button 
            :class="['nav-btn', { active: activeView === 'notes' }]"
            @click="setViewAndClose('notes')"
          >
            Toutes les Notes
          </button>
          <button 
            :class="['nav-btn', { active: activeView === 'upload' }]"
            @click="setViewAndClose('upload')"
          >
            Importer Élèves
          </button>
          <button 
            :class="['nav-btn', { active: activeView === 'generer-lien' }]"
            @click="setViewAndClose('generer-lien')"
          >
            Générer le lien
          </button>
        </nav>
      </div>

      <div class="main-content">
        <!-- Vue Mes Classes (comme professeur) -->
        <div v-if="activeView === 'mes-classes' && !selectedClasse" class="view">
          <h2>Mes Classes</h2>
          <div v-if="loadingMesClasses" class="loading">Chargement...</div>
          <div v-else-if="mesClasses.length === 0" class="empty">Aucune classe assignée</div>
          <div v-else class="classes-grid">
            <div 
              v-for="classe in mesClasses" 
              :key="classe.id"
              class="classe-card"
              @click="selectClasse(classe)"
            >
              <h3>{{ classe.nom }}</h3>
              <p>{{ classe.filiere_nom }}</p>
            </div>
          </div>
        </div>

        <!-- Vue Sélection Matière après sélection de Classe -->
        <div v-if="activeView === 'mes-classes' && selectedClasse && !selectedMatiere" class="view">
          <div class="view-header">
            <button @click="goBackToMesClasses" class="btn-back">← Retour</button>
            <h2>Matières - {{ selectedClasse.nom }}</h2>
          </div>
          <div v-if="loadingMatieresClasse" class="loading">Chargement...</div>
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

        <!-- Vue Tableau des Élèves avec Notes -->
        <div v-if="activeView === 'mes-classes' && selectedClasse && selectedMatiere" class="view">
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
          <div v-else class="table-container">
            <table class="notes-table">
              <thead>
                <tr>
                  <th rowspan="2">Code</th>
                  <th rowspan="2">Nom</th>
                  <th rowspan="2">Prénom</th>
                  <th colspan="6" class="section-header">Interrogations</th>
                  <th colspan="3" class="section-header">Devoirs</th>
                  <th rowspan="2">Coeff.</th>
                  <th rowspan="2">Moyenne</th>
                  <th rowspan="2">Moy. Coeff.</th>
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
                <tr v-for="eleve in elevesWithNotes" :key="eleve.id">
                  <td>{{ eleve.code }}</td>
                  <td>{{ eleve.nom }}</td>
                  <td>{{ eleve.prenom }}</td>
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
        </div>

        <!-- Vue Professeurs -->
        <div v-if="activeView === 'professeurs'" class="view">
          <h2>Liste des Professeurs</h2>
          <div v-if="loading" class="loading">Chargement...</div>
          <div v-else-if="professeurs.length === 0" class="empty">Aucun professeur</div>
          <div v-else class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Code</th>
                  <th>Rôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="prof in professeurs" :key="prof.id">
                  <td>{{ prof.nom }}</td>
                  <td>{{ prof.prenom }}</td>
                  <td>{{ prof.code_professeur }}</td>
                  <td>
                    <span :class="['badge', prof.role === 'ADMIN' ? 'badge-admin' : 'badge-prof']">
                      {{ prof.role }}
                    </span>
                  </td>
                  <td>
                    <button 
                      @click="openEditProfModal(prof)" 
                      class="btn-edit-prof"
                      title="Modifier le nom"
                    >
                      Modifier
                    </button>
                    <button 
                      @click="resetCode(prof)" 
                      class="btn-reset-code"
                      :disabled="resettingCode === prof.id"
                      title="Réinitialiser le code d'accès"
                    >
                      <Icon v-if="resettingCode !== prof.id" name="refresh" :size="16" class="reset-icon" />
                      {{ resettingCode === prof.id ? '...' : 'Réinitialiser' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Vue Élèves -->
        <div v-if="activeView === 'eleves'" class="view">
          <div class="view-header">
            <h2>Liste des Élèves</h2>
            <button @click="openAddEleveModal" class="btn-add-eleve">
              <Icon name="edit" :size="16" class="btn-icon-inline" />
              Ajouter un élève
            </button>
          </div>
          <div v-if="loading" class="loading">Chargement...</div>
          <div v-else-if="eleves.length === 0" class="empty">Aucun élève</div>
          <div v-else>
            <div v-for="group in elevesByClasse" :key="group.classe" class="classe-section">
              <h3 class="classe-title">{{ group.classe }}</h3>
              <div class="table-container">
                <table class="table-section">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Code Secret</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="eleve in group.eleves" :key="eleve.id">
                      <td>{{ eleve.nom }}</td>
                      <td>{{ eleve.prenom }}</td>
                      <td>{{ eleve.code_secret }}</td>
                      <td>
                        <button 
                          type="button"
                          @click="openEditEleveModal(eleve)" 
                          class="btn-edit-eleve"
                          title="Modifier l'élève"
                        >
                          Modifier
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Vue Matières -->
        <div v-if="activeView === 'matieres'" class="view">
          <div class="view-header">
            <h2>Liste des Matières</h2>
            <button @click="openAddMatiereModal" class="btn-add-matiere">
              <Icon name="edit" :size="16" class="btn-icon-inline" />
              Ajouter une matière
            </button>
          </div>
          <div v-if="loading" class="loading">Chargement...</div>
          <div v-else-if="matieres.length === 0" class="empty">Aucune matière</div>
          <div v-else>
            <div v-for="group in matieresByClasse" :key="group.classe" class="classe-section">
              <h3 class="classe-title">{{ group.classe }}</h3>
              <div class="table-container">
                <table class="table-section">
                  <thead>
                    <tr>
                      <th>Matière</th>
                      <th>Professeur</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="matiere in group.matieres" :key="matiere.id">
                      <td>{{ matiere.nom }}</td>
                      <td>{{ matiere.professeur_prenom }} {{ matiere.professeur_nom }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Vue Notes -->
        <div v-if="activeView === 'notes'" class="view">
          <h2>Toutes les Notes</h2>
          <div v-if="loading" class="loading">Chargement...</div>
          <div v-else-if="notes.length === 0" class="empty">Aucune note</div>
          <div v-else>
            <div v-for="group in notesByClasse" :key="group.classe" class="classe-section">
              <h3 class="classe-title">{{ group.classe }}</h3>
              <div class="table-container">
                <table class="table-section">
                  <thead>
                    <tr>
                      <th>Élève</th>
                      <th>Nombre de notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="eleve in notesByEleve.filter(e => e.classe_nom === group.classe)" :key="eleve.eleve_id">
                      <td>
                        <button 
                          @click="openEleveDetails(eleve.eleve_id)"
                          class="btn-eleve-name"
                        >
                          {{ eleve.eleve_prenom }} {{ eleve.eleve_nom }}
                        </button>
                      </td>
                      <td>{{ eleve.nombre_notes }} note(s)</td>
                      <td>
                        <button 
                          @click="openEleveDetails(eleve.eleve_id)"
                          class="btn-view-details"
                        >
                          Voir les détails
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Vue Générer le lien -->
        <div v-if="activeView === 'generer-lien'" class="view">
          <h2>Générer le lien d'accès pour les parents</h2>
          <div class="link-generation-card">
            <div class="link-info">
              <p class="info-text">
                <Icon name="info" :size="20" class="info-icon" />
                Générez un lien unique que vous pourrez partager avec les parents d'élèves. 
                En cliquant sur ce lien, ils devront entrer le code secret de leur enfant pour accéder à son espace.
              </p>
            </div>
            
            <div class="link-section">
              <label for="parent-link">Lien d'accès parents :</label>
              <div class="link-input-group">
                <input 
                  :key="linkKey"
                  id="parent-link"
                  type="text" 
                  v-model="parentAccessLink"
                  readonly
                  class="link-input"
                  ref="linkInput"
                />
                <button 
                  @click="copyLink" 
                  class="btn-copy-link"
                  :class="{ 'copied': linkCopied }"
                >
                  <Icon :name="linkCopied ? 'check' : 'copy'" :size="18" />
                  {{ linkCopied ? 'Copié !' : 'Copier' }}
                </button>
              </div>
              <p v-if="parentAccessLink" class="link-open-text">
                Ouvrir le lien :
                <a :href="parentAccessLink" target="_blank" rel="noopener noreferrer" class="link-clickable">
                  {{ parentAccessLink }}
                </a>
              </p>
            </div>

            <div class="link-actions">
              <button @click="generateNewLink" class="btn-generate">
                <Icon name="refresh" :size="18" />
                Générer un nouveau lien
              </button>
            </div>

            <div class="link-instructions">
              <h3>Instructions :</h3>
              <ol>
                <li>Cliquez sur "Copier" pour copier le lien</li>
                <li>Partagez ce lien dans le groupe WhatsApp ou par email aux parents</li>
                <li>Les parents cliqueront sur le lien et entreront le code secret de leur enfant</li>
                <li>Ils seront automatiquement redirigés vers l'espace de leur enfant</li>
              </ol>
            </div>
          </div>
        </div>

        <!-- Vue Upload Élèves -->
        <div v-if="activeView === 'upload'" class="view">
          <h2>Importer des Élèves</h2>
          
          <div class="upload-section">
            <div class="upload-info">
              <h3>Instructions</h3>
              <ul>
                <li>Téléversez un fichier Excel (.xlsx, .xls) ou Word (.docx)</li>
                <li>Le fichier doit contenir les colonnes suivantes : <strong>Nom, Prénom, Classe, Filière</strong></li>
                <li>Pour Excel : La première ligne doit contenir les en-têtes</li>
                <li>Pour Word : Format attendu : Nom, Prénom, Classe, Filière (une ligne par élève)</li>
                <li>Un code secret unique sera généré automatiquement pour chaque élève</li>
              </ul>
            </div>

            <div class="upload-form">
              <form @submit.prevent="handleUpload" enctype="multipart/form-data">
                <div class="file-input-wrapper">
                  <input
                    type="file"
                    ref="fileInput"
                    @change="handleFileSelect"
                    accept=".xlsx,.xls,.docx"
                    required
                    class="file-input"
                  />
                  <label v-if="selectedFile" class="file-label">
                    Fichier sélectionné : {{ selectedFile.name }}
                  </label>
                  <label v-else class="file-label">
                    Cliquez pour sélectionner un fichier
                  </label>
                </div>

                <button 
                  type="submit" 
                  class="btn-upload" 
                  :disabled="uploading || !selectedFile"
                >
                  {{ uploading ? 'Téléversement en cours...' : 'Téléverser et Importer' }}
                </button>
              </form>
            </div>

            <!-- Résultats de l'upload -->
            <div v-if="uploadResult" class="upload-result">
              <div class="result-summary">
                <h3>Résultats de l'import</h3>
                <div class="stats">
                  <div class="stat-item success">
                    <strong>{{ uploadResult.reussi }}</strong> élève(s) créé(s)
                  </div>
                  <div class="stat-item error" v-if="uploadResult.echec > 0">
                    <strong>{{ uploadResult.echec }}</strong> erreur(s)
                  </div>
                  <div class="stat-item">
                    Total : <strong>{{ uploadResult.total }}</strong>
                  </div>
                </div>
              </div>

              <!-- Élèves créés avec succès -->
              <div v-if="uploadResult.succes && uploadResult.succes.length > 0" class="result-section success-section">
                <h4><Icon name="check" :size="20" class="success-icon-inline" /> Élèves créés avec succès</h4>
                <div class="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Classe</th>
                        <th>Filière</th>
                        <th>Code Secret</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(eleve, index) in uploadResult.succes" :key="index">
                        <td>{{ eleve.nom }}</td>
                        <td>{{ eleve.prenom }}</td>
                        <td>{{ eleve.classe }}</td>
                        <td>{{ eleve.filiere }}</td>
                        <td><strong class="code-secret">{{ eleve.code_secret }}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Erreurs -->
              <div v-if="uploadResult.erreurs && uploadResult.erreurs.length > 0" class="result-section error-section">
                <h4>❌ Erreurs</h4>
                <div class="errors-list">
                  <div v-for="(erreur, index) in uploadResult.erreurs" :key="index" class="error-item">
                    <strong>Ligne {{ erreur.ligne }}:</strong> {{ erreur.raison }}
                    <span v-if="erreur.donnees"> - {{ erreur.donnees.nom }} {{ erreur.donnees.prenom }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal édition professeur -->
    <div v-if="showEditProfModal" class="modal-overlay" @click="closeEditProfModal">
      <div class="modal" @click.stop>
        <h3>Modifier le professeur</h3>
        <form @submit.prevent="saveProfesseur">
          <div class="form-group">
            <label>Nom <span class="required">*</span></label>
            <input v-model="editProfForm.nom" type="text" required />
          </div>
          <div class="form-group">
            <label>Prénom <span class="required">*</span></label>
            <input v-model="editProfForm.prenom" type="text" required />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeEditProfModal">Annuler</button>
            <button type="submit" class="btn-save">Enregistrer</button>
          </div>
        </form>
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

    <!-- Modal Ajout / Modification Élève -->
    <div v-if="showAddEleveModal" class="modal-overlay" @click="closeAddEleveModal">
      <div class="modal" @click.stop>
        <h3>{{ editingEleveId ? 'Modifier l\'élève' : 'Ajouter un nouvel élève' }}</h3>
        <form @submit.prevent="saveEleve">
          <div class="form-group">
            <label for="eleve-nom">Nom <span class="required">*</span></label>
            <input 
              v-model="eleveForm.nom" 
              type="text" 
              id="eleve-nom" 
              required
              placeholder="Ex: DUPONT"
              maxlength="100"
            />
          </div>
          <div class="form-group">
            <label for="eleve-prenom">Prénom <span class="required">*</span></label>
            <input 
              v-model="eleveForm.prenom" 
              type="text" 
              id="eleve-prenom" 
              required
              placeholder="Ex: Jean"
              maxlength="100"
            />
          </div>
          <div class="form-group">
            <label for="eleve-filiere">Filière <span class="required">*</span></label>
            <select v-model="eleveForm.filiere_id" id="eleve-filiere" required @change="onFiliereChange">
              <option value="">Sélectionner une filière</option>
              <option 
                v-for="filiere in filieres" 
                :key="filiere.id" 
                :value="filiere.id"
              >
                {{ filiere.nom }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="eleve-classe">Classe <span class="required">*</span></label>
            <select 
              v-model="eleveForm.classe_id" 
              id="eleve-classe" 
              required
              :disabled="!eleveForm.filiere_id || classesFiltered.length === 0"
            >
              <option value="">Sélectionner une classe</option>
              <option 
                v-for="classe in classesFiltered" 
                :key="classe.id" 
                :value="classe.id"
              >
                {{ classe.nom }}
              </option>
            </select>
            <small v-if="!eleveForm.filiere_id" class="form-hint">
              Veuillez d'abord sélectionner une filière
            </small>
          </div>
          <div v-if="!editingEleveId" class="form-info">
            <Icon name="info" :size="16" class="info-icon-small" />
            <span>Le code secret sera généré automatiquement après l'enregistrement</span>
          </div>
          <div v-else class="form-info">
            <Icon name="info" :size="16" class="info-icon-small" />
            <span>Le code secret reste inchangé</span>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeAddEleveModal" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-save" :disabled="savingEleve">
              {{ savingEleve ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Ajout Matière -->
    <div v-if="showAddMatiereModal" class="modal-overlay" @click="closeAddMatiereModal">
      <div class="modal" @click.stop>
        <h3>Ajouter une matière</h3>
        <form @submit.prevent="saveMatiere">
          <div class="form-group">
            <label>Nom de la matière <span class="required">*</span></label>
            <input 
              v-model="matiereForm.nom" 
              type="text" 
              required
              placeholder="Ex: Mathématiques"
              maxlength="100"
            />
          </div>
          <div class="form-group">
            <label>Classe <span class="required">*</span></label>
            <select v-model="matiereForm.classe_id" required>
              <option value="">Sélectionner une classe</option>
              <option 
                v-for="classe in classes" 
                :key="classe.id" 
                :value="classe.id"
              >
                {{ classe.nom }} ({{ classe.filiere_nom }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Professeur <span class="required">*</span></label>
            <select v-model="matiereForm.professeur_id" required>
              <option value="">Sélectionner un professeur</option>
              <option 
                v-for="prof in professeurs" 
                :key="prof.id" 
                :value="prof.id"
              >
                {{ prof.prenom }} {{ prof.nom }} {{ prof.role === 'ADMIN' ? '(Admin)' : '' }}
              </option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeAddMatiereModal" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-save" :disabled="savingMatiere">
              {{ savingMatiere ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Espace Élève Détaillé -->
    <div v-if="showEleveDetailsModal" class="modal-overlay modal-large" @click="closeEleveDetailsModal">
      <div class="modal modal-large-content" @click.stop>
        <div class="modal-header">
          <h3>Espace Élève - {{ selectedEleveForDetails?.prenom }} {{ selectedEleveForDetails?.nom }}</h3>
          <button @click="closeEleveDetailsModal" class="btn-close-modal">×</button>
        </div>
        <div v-if="loadingEleveDetails" class="loading">Chargement des données...</div>
        <div v-else-if="eleveDetailsData" class="eleve-details-content">
          <div class="eleve-info">
            <p><strong>Classe :</strong> {{ eleveDetailsData.eleve.classe_nom }}</p>
            <p><strong>Filière :</strong> {{ eleveDetailsData.eleve.filiere_nom }}</p>
          </div>
          <div v-if="eleveDetailsData.matieres.length === 0" class="empty">Aucune note enregistrée</div>
          <div v-else>
            <div v-for="matiere in eleveDetailsData.matieres" :key="matiere.matiere_id" class="matiere-section">
              <h4 class="matiere-title">{{ matiere.matiere_nom }}</h4>
              <div v-for="trimestre in matiere.trimestres" :key="trimestre.trimestre" class="trimestre-section">
                <h5 class="trimestre-title">Trimestre {{ trimestre.trimestre }}</h5>
                <div class="table-container">
                  <table class="notes-detail-table">
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

    <!-- Modal affichage nouveau code -->
    <div v-if="showCodeModal && newCodeDisplay" class="modal-overlay" @click="closeCodeModal">
      <div class="modal" @click.stop>
        <h3>Code Réinitialisé</h3>
        <div class="modal-content">
          <p><strong>{{ newCodeDisplay.professeur.prenom }} {{ newCodeDisplay.professeur.nom }}</strong></p>
          <div class="code-box">
            <p class="code-label">Nouveau code d'accès :</p>
            <div class="code-value">{{ newCodeDisplay.newCode }}</div>
          </div>
          <div class="code-warning">
            <strong><Icon name="warning" :size="18" class="warning-icon-inline" /> Important :</strong>
            <p>Ce code est strictement personnel. Il ne sera plus affiché ultérieurement.</p>
            <p>Communiquez-le au professeur de manière sécurisée.</p>
          </div>
          <div class="modal-actions">
            <button @click="copyNewCode" class="btn-copy">📋 Copier</button>
            <button @click="closeCodeModal" class="btn-close">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import api from '../services/api'
import Icon from '../components/Icons.vue'

export default {
  name: 'Responsable',
  components: {
    Icon
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    // Initialiser user depuis le store
    const user = computed(() => authStore.user)
    
    const activeView = ref('professeurs')
    const sidebarOpen = ref(false)
    const loading = ref(false)
    const professeurs = ref([])
    const eleves = ref([])
    const classes = ref([])
    const matieres = ref([])
    const notes = ref([])
    const selectedFile = ref(null)
    const uploading = ref(false)
    const uploadResult = ref(null)
    const fileInput = ref(null)
    const resettingCode = ref(null)
    const newCodeDisplay = ref(null)
    const showCodeModal = ref(false)
    const showEditProfModal = ref(false)
    const editProfForm = ref({ id: null, nom: '', prenom: '' })
    
    // Variables pour l'ajout / modification d'élève
    const showAddEleveModal = ref(false)
    const editingEleveId = ref(null)
    const savingEleve = ref(false)
    const eleveForm = ref({
      nom: '',
      prenom: '',
      filiere_id: '',
      classe_id: ''
    })
    const filieres = ref([])

    // Variables pour l'ajout de matière
    const showAddMatiereModal = ref(false)
    const savingMatiere = ref(false)
    const matiereForm = ref({
      nom: '',
      classe_id: '',
      professeur_id: ''
    })
    
    // Variables pour l'espace élève détaillé
    const showEleveDetailsModal = ref(false)
    const selectedEleveForDetails = ref(null)
    const eleveDetailsData = ref(null)
    const loadingEleveDetails = ref(false)
    
    // Variables pour la génération de lien parent
    const parentAccessLink = ref('')
    const linkCopied = ref(false)
    const linkInput = ref(null)
    const linkKey = ref(0)

    // Générer le lien d'accès parent (avec paramètre de version pour mettre à jour le champ à chaque clic)
    const generateParentLink = () => {
      const baseUrl = window.location.origin
      const path = `${baseUrl}/parent-access?v=${Date.now()}`
      parentAccessLink.value = path
      linkKey.value++
    }

    // Copier le lien dans le presse-papiers
    const copyLink = async () => {
      if (!parentAccessLink.value) {
        generateParentLink()
      }
      
      try {
        await navigator.clipboard.writeText(parentAccessLink.value)
        linkCopied.value = true
        setTimeout(() => {
          linkCopied.value = false
        }, 2000)
      } catch (err) {
        // Fallback pour les navigateurs qui ne supportent pas l'API Clipboard
        if (linkInput.value) {
          linkInput.value.select()
          document.execCommand('copy')
          linkCopied.value = true
          setTimeout(() => {
            linkCopied.value = false
          }, 2000)
        }
      }
    }

    const generateNewLink = () => {
      linkCopied.value = false
      generateParentLink()
    }
    
    // Variables pour "Mes Classes" (fonctionnalité professeur)
    const mesClasses = ref([])
    const mesMatieres = ref([])
    const selectedClasse = ref(null)
    const selectedMatiere = ref(null)
    const selectedTrimestre = ref(1)
    const elevesWithNotes = ref([])
    const matieresClasse = ref([])
    const loadingMesClasses = ref(false)
    const loadingMatieresClasse = ref(false)
    const loadingEleves = ref(false)
    const showAddNoteModal = ref(false)
    const editingNoteId = ref(null)
    const selectedEleve = ref(null)
    const savingNote = ref(false)
    const noteForm = ref({
      eleve_id: '',
      matiere_id: '',
      trimestre: 1,
      type: 'Interrogation',
      valeur: ''
    })

    const loadProfesseurs = async () => {
      console.log('🔄 loadProfesseurs appelé')
      loading.value = true
      try {
        console.log('📡 Appel API: GET /responsable/professeurs')
        const response = await api.get('/responsable/professeurs')
        console.log('✅ Réponse reçue:', response.status, response.data)
        professeurs.value = response.data || []
        console.log('✅ Professeurs stockés:', professeurs.value.length, 'professeurs')
      } catch (error) {
        console.error('❌ Erreur chargement professeurs:', error)
        console.error('❌ Détails erreur:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText
        })
        const errorMsg = error.response?.data?.message || error.message || 'Erreur lors du chargement des professeurs'
        alert(`Erreur chargement professeurs: ${errorMsg}\n\nVérifiez la console (F12) pour plus de détails.`)
      } finally {
        loading.value = false
        console.log('🏁 loadProfesseurs terminé, loading =', loading.value)
      }
    }

    const loadEleves = async () => {
      loading.value = true
      try {
        console.log('Chargement élèves...')
        const response = await api.get('/responsable/eleves')
        console.log('Élèves chargés:', response.data)
        eleves.value = response.data
      } catch (error) {
        console.error('Erreur chargement élèves:', error)
        const errorMsg = error.response?.data?.message || error.message || 'Erreur lors du chargement des élèves'
        alert(`Erreur: ${errorMsg}`)
      } finally {
        loading.value = false
      }
    }

    const loadClasses = async () => {
      loading.value = true
      try {
        console.log('Chargement classes...')
        const response = await api.get('/responsable/classes')
        console.log('Classes chargées:', response.data)
        classes.value = response.data
      } catch (error) {
        console.error('Erreur chargement classes:', error)
        const errorMsg = error.response?.data?.message || error.message || 'Erreur lors du chargement des classes'
        alert(`Erreur: ${errorMsg}`)
      } finally {
        loading.value = false
      }
    }

    const loadMatieres = async () => {
      loading.value = true
      try {
        console.log('Chargement matières...')
        const response = await api.get('/responsable/matieres')
        console.log('Matières chargées:', response.data)
        matieres.value = response.data
      } catch (error) {
        console.error('Erreur chargement matières:', error)
        const errorMsg = error.response?.data?.message || error.message || 'Erreur lors du chargement des matières'
        alert(`Erreur: ${errorMsg}`)
      } finally {
        loading.value = false
      }
    }

    const loadNotes = async () => {
      loading.value = true
      try {
        console.log('Chargement notes...')
        const response = await api.get('/responsable/notes')
        console.log('Notes chargées:', response.data)
        notes.value = response.data
      } catch (error) {
        console.error('Erreur chargement notes:', error)
        const errorMsg = error.response?.data?.message || error.message || 'Erreur lors du chargement des notes'
        alert(`Erreur: ${errorMsg}`)
      } finally {
        loading.value = false
      }
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR')
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        selectedFile.value = file
        uploadResult.value = null
      }
    }

    const handleUpload = async () => {
      if (!selectedFile.value) return

      uploading.value = true
      uploadResult.value = null

      try {
        console.log('Début upload fichier:', {
          name: selectedFile.value.name,
          size: selectedFile.value.size,
          type: selectedFile.value.type
        })

        const formData = new FormData()
        formData.append('file', selectedFile.value)

        // Ne pas définir Content-Type manuellement, le navigateur le fera automatiquement avec le boundary
        const response = await api.post('/responsable/upload-eleves', formData, {
          timeout: 60000, // 60 secondes
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            console.log(`Upload progress: ${percentCompleted}%`)
          }
        })

        uploadResult.value = response.data
        
        // Recharger la liste des élèves si l'upload a réussi
        if (response.data.reussi > 0) {
          await loadEleves()
        }

        // Réinitialiser le formulaire
        selectedFile.value = null
        if (fileInput.value) {
          fileInput.value.value = ''
        }
      } catch (error) {
        let errorMessage = 'Erreur lors du téléversement du fichier'
        
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Le téléversement a pris trop de temps. Veuillez réessayer avec un fichier plus petit.'
        } else if (error.message === 'Network Error' || !error.response) {
          errorMessage = 'Erreur de connexion au serveur. Vérifiez que le serveur backend est démarré sur le port 5000.'
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }
        
        alert(errorMessage)
        console.error('Erreur upload complète:', {
          message: errorMessage,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status,
          error: error
        })
      } finally {
        uploading.value = false
      }
    }

    const resetCode = async (prof) => {
      if (!confirm(`Êtes-vous sûr de vouloir réinitialiser le code d'accès de ${prof.prenom} ${prof.nom} ?\n\nLe nouveau code sera généré et affiché une seule fois.`)) {
        return
      }

      resettingCode.value = prof.id
      try {
        const response = await api.post(`/responsable/professeurs/${prof.id}/reset-code`)
        newCodeDisplay.value = {
          professeur: prof,
          newCode: response.data.code_professeur
        }
        showCodeModal.value = true
        // Recharger la liste des professeurs
        await loadProfesseurs()
      } catch (error) {
        alert(error.response?.data?.message || 'Erreur lors de la réinitialisation du code')
      } finally {
        resettingCode.value = null
      }
    }

    const openEditProfModal = (prof) => {
      editProfForm.value = {
        id: prof.id,
        nom: prof.nom,
        prenom: prof.prenom
      }
      showEditProfModal.value = true
    }

    const closeEditProfModal = () => {
      showEditProfModal.value = false
      editProfForm.value = { id: null, nom: '', prenom: '' }
    }

    const saveProfesseur = async () => {
      if (!editProfForm.value.nom || !editProfForm.value.prenom) {
        alert('Veuillez remplir le nom et le prénom')
        return
      }
      try {
        await api.put(`/responsable/professeurs/${editProfForm.value.id}`, {
          nom: editProfForm.value.nom,
          prenom: editProfForm.value.prenom
        })
        closeEditProfModal()
        await loadProfesseurs()
      } catch (error) {
        alert(error.response?.data?.message || 'Erreur lors de la mise à jour du professeur')
      }
    }

    const closeCodeModal = () => {
      showCodeModal.value = false
      newCodeDisplay.value = null
    }

    const copyNewCode = () => {
      if (newCodeDisplay.value?.newCode) {
        navigator.clipboard.writeText(newCodeDisplay.value.newCode).then(() => {
          alert('Code copié dans le presse-papiers !')
        })
      }
    }

    // Fonctions pour l'ajout d'élève
    const loadFilieres = async () => {
      try {
        const response = await api.get('/responsable/filieres')
        filieres.value = response.data
      } catch (error) {
        console.error('Erreur chargement filières:', error)
        alert('Erreur lors du chargement des filières')
      }
    }

    const openAddEleveModal = async () => {
      editingEleveId.value = null
      // Charger les filières si pas encore chargées
      if (filieres.value.length === 0) {
        await loadFilieres()
      }
      // Charger les classes si pas encore chargées
      if (classes.value.length === 0) {
        await loadClasses()
      }
      eleveForm.value = { nom: '', prenom: '', filiere_id: '', classe_id: '' }
      showAddEleveModal.value = true
    }

    const openEditEleveModal = async (eleve) => {
      if (filieres.value.length === 0) await loadFilieres()
      if (classes.value.length === 0) await loadClasses()
      const classe = classes.value.find(c => c.id == eleve.classe_id)
      editingEleveId.value = eleve.id
      eleveForm.value = {
        nom: eleve.nom,
        prenom: eleve.prenom,
        filiere_id: classe ? classe.filiere_id : '',
        classe_id: eleve.classe_id
      }
      showAddEleveModal.value = true
    }

    const closeAddEleveModal = () => {
      showAddEleveModal.value = false
      editingEleveId.value = null
      eleveForm.value = {
        nom: '',
        prenom: '',
        filiere_id: '',
        classe_id: ''
      }
    }

    const onFiliereChange = () => {
      // Réinitialiser la classe quand la filière change
      eleveForm.value.classe_id = ''
    }

    const classesFiltered = computed(() => {
      if (!eleveForm.value.filiere_id) {
        return []
      }
      return classes.value.filter(c => c.filiere_id == eleveForm.value.filiere_id)
    })

    const saveEleve = async () => {
      if (!eleveForm.value.nom || !eleveForm.value.prenom || !eleveForm.value.filiere_id || !eleveForm.value.classe_id) {
        alert('Veuillez remplir tous les champs')
        return
      }

      savingEleve.value = true
      try {
        if (editingEleveId.value) {
          await api.put(`/responsable/eleves/${editingEleveId.value}`, {
            nom: eleveForm.value.nom,
            prenom: eleveForm.value.prenom,
            classe_id: eleveForm.value.classe_id
          })
          closeAddEleveModal()
          await loadEleves()
          alert('Élève modifié avec succès')
        } else {
          const response = await api.post('/responsable/eleves', eleveForm.value)
          closeAddEleveModal()
          await loadEleves()
          alert(`Élève créé avec succès !\nCode secret : ${response.data.code_secret}`)
        }
      } catch (error) {
        alert(error.response?.data?.message || 'Erreur lors de l\'enregistrement de l\'élève')
      } finally {
        savingEleve.value = false
      }
    }

    // Fonctions pour l'ajout de matière
    const openAddMatiereModal = () => {
      // Pré-remplir avec l'admin connecté par défaut
      matiereForm.value = {
        nom: '',
        classe_id: '',
        professeur_id: (user && user.value && user.value.id) || ''
      }
      showAddMatiereModal.value = true
    }

    const closeAddMatiereModal = () => {
      showAddMatiereModal.value = false
      matiereForm.value = {
        nom: '',
        classe_id: '',
        professeur_id: ''
      }
    }

    const saveMatiere = async () => {
      if (!matiereForm.value.nom || !matiereForm.value.classe_id || !matiereForm.value.professeur_id) {
        alert('Veuillez remplir tous les champs')
        return
      }

      savingMatiere.value = true
      try {
        await api.post('/responsable/matieres', matiereForm.value)
        closeAddMatiereModal()
        // Recharger la liste des matières
        await loadMatieres()
        alert('Matière créée avec succès !')
      } catch (error) {
        alert(error.response?.data?.message || 'Erreur lors de la création de la matière')
      } finally {
        savingMatiere.value = false
      }
    }

    // Fonctions pour l'espace élève détaillé
    const openEleveDetails = async (eleve_id) => {
      loadingEleveDetails.value = true
      showEleveDetailsModal.value = true
      try {
        const response = await api.get(`/responsable/eleves/${eleve_id}/notes-organisees`)
        eleveDetailsData.value = response.data
        selectedEleveForDetails.value = response.data.eleve
      } catch (error) {
        alert(error.response?.data?.message || 'Erreur lors du chargement des données de l\'élève')
        closeEleveDetailsModal()
      } finally {
        loadingEleveDetails.value = false
      }
    }

    const closeEleveDetailsModal = () => {
      showEleveDetailsModal.value = false
      selectedEleveForDetails.value = null
      eleveDetailsData.value = null
    }

    // Fonctions pour "Mes Classes" (fonctionnalité professeur)
    const loadMesClasses = async () => {
      loadingMesClasses.value = true
      try {
        console.log('Chargement mes classes...')
        const response = await api.get('/professeur/classes')
        console.log('Mes classes chargées:', response.data)
        mesClasses.value = response.data
      } catch (error) {
        console.error('Erreur chargement mes classes:', error)
        const errorMsg = error.response?.data?.message || error.message || 'Erreur lors du chargement des classes'
        alert(`Erreur: ${errorMsg}`)
      } finally {
        loadingMesClasses.value = false
      }
    }

    const loadMesMatieres = async () => {
      try {
        const response = await api.get('/professeur/matieres')
        mesMatieres.value = response.data
      } catch (error) {
        console.error('Erreur chargement mes matières:', error)
      }
    }

    const selectClasse = async (classe) => {
      selectedClasse.value = classe
      selectedMatiere.value = null
      loadingMatieresClasse.value = true
      try {
        const allMatieres = await api.get('/professeur/matieres')
        matieresClasse.value = allMatieres.data.filter(m => m.classe_id === classe.id)
      } catch (error) {
        console.error('Erreur chargement matières:', error)
      } finally {
        loadingMatieresClasse.value = false
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

    const goToMesClasses = () => {
      activeView.value = 'mes-classes'
      selectedClasse.value = null
      selectedMatiere.value = null
      if (mesClasses.value.length === 0) {
        loadMesClasses()
      }
    }

    const setViewAndClose = (view) => {
      activeView.value = view
      sidebarOpen.value = false
    }

    const goBackToMesClasses = () => {
      selectedClasse.value = null
      selectedMatiere.value = null
    }

    const goBackToClasse = () => {
      selectedMatiere.value = null
    }

    const matieresDisponibles = computed(() => {
      if (selectedClasse.value) {
        return mesMatieres.value.filter(m => m.classe_id === selectedClasse.value.id)
      }
      return mesMatieres.value
    })

    // Grouper les élèves par classe
    const elevesByClasse = computed(() => {
      const grouped = {}
      eleves.value.forEach(eleve => {
        const classeNom = eleve.classe_nom || 'Sans classe'
        if (!grouped[classeNom]) {
          grouped[classeNom] = []
        }
        grouped[classeNom].push(eleve)
      })
      // Trier les classes par nom
      return Object.keys(grouped).sort().map(classeNom => ({
        classe: classeNom,
        eleves: grouped[classeNom].sort((a, b) => {
          if (a.nom !== b.nom) return a.nom.localeCompare(b.nom)
          return a.prenom.localeCompare(b.prenom)
        })
      }))
    })

    // Grouper les matières par classe
    const matieresByClasse = computed(() => {
      const grouped = {}
      matieres.value.forEach(matiere => {
        const classeNom = matiere.classe_nom || 'Sans classe'
        if (!grouped[classeNom]) {
          grouped[classeNom] = []
        }
        grouped[classeNom].push(matiere)
      })
      // Trier les classes par nom
      return Object.keys(grouped).sort().map(classeNom => ({
        classe: classeNom,
        matieres: grouped[classeNom].sort((a, b) => a.nom.localeCompare(b.nom))
      }))
    })

    // Grouper les notes par classe
    const notesByClasse = computed(() => {
      const grouped = {}
      notes.value.forEach(note => {
        const classeNom = note.classe_nom || 'Sans classe'
        if (!grouped[classeNom]) {
          grouped[classeNom] = []
        }
        grouped[classeNom].push(note)
      })
      // Trier les classes par nom
      return Object.keys(grouped).sort().map(classeNom => ({
        classe: classeNom,
        notes: grouped[classeNom].sort((a, b) => {
          // Trier par date (plus récentes en premier)
          return new Date(b.date_saisie) - new Date(a.date_saisie)
        })
      }))
    })

    // Grouper les notes par élève (chaque élève apparaît une seule fois)
    const notesByEleve = computed(() => {
      const elevesMap = {}
      notes.value.forEach(note => {
        const eleveKey = `${note.eleve_id}_${note.eleve_nom}_${note.eleve_prenom}`
        if (!elevesMap[eleveKey]) {
          elevesMap[eleveKey] = {
            eleve_id: note.eleve_id,
            eleve_nom: note.eleve_nom,
            eleve_prenom: note.eleve_prenom,
            classe_nom: note.classe_nom,
            nombre_notes: 0
          }
        }
        elevesMap[eleveKey].nombre_notes++
      })
      // Convertir en tableau et trier par classe puis nom
      return Object.values(elevesMap).sort((a, b) => {
        if (a.classe_nom !== b.classe_nom) {
          return a.classe_nom.localeCompare(b.classe_nom)
        }
        if (a.eleve_nom !== b.eleve_nom) {
          return a.eleve_nom.localeCompare(b.eleve_nom)
        }
        return a.eleve_prenom.localeCompare(b.eleve_prenom)
      })
    })

    const logout = () => {
      authStore.logout()
      router.push('/')
    }

    watch(activeView, (newView, oldView) => {
      console.log('🔄 Changement de vue:', oldView || 'initial', '->', newView)
      if (newView === 'mes-classes') {
        if (mesClasses.value.length === 0) {
          console.log('📚 Chargement mes classes...')
          loadMesClasses()
        }
        if (mesMatieres.value.length === 0) {
          console.log('📚 Chargement mes matières...')
          loadMesMatieres()
        }
      } else if (newView === 'professeurs') {
        console.log('👨‍🏫 Chargement professeurs...')
        // Toujours recharger pour avoir les données à jour
        loadProfesseurs()
      } else if (newView === 'eleves') {
        console.log('👨‍🎓 Chargement élèves...')
        // Toujours recharger pour avoir les données à jour
        loadEleves()
      } else if (newView === 'matieres') {
        console.log('📖 Chargement matières...')
        // Toujours recharger pour avoir les données à jour
        loadMatieres()
        // Charger aussi les classes et professeurs pour le formulaire
        if (classes.value.length === 0) {
          console.log('🏫 Chargement classes pour formulaire...')
          loadClasses()
        }
        if (professeurs.value.length === 0) {
          console.log('👨‍🏫 Chargement professeurs pour formulaire...')
          loadProfesseurs()
        }
      } else if (newView === 'notes') {
        console.log('📝 Chargement notes...')
        // Toujours recharger pour avoir les données à jour
        loadNotes()
      } else if (newView === 'generer-lien') {
        if (!parentAccessLink.value) {
          generateParentLink()
        }
      }
    })

    onMounted(async () => {
      console.log('🚀 Responsable.vue: onMounted appelé')
      console.log('🔐 Responsable.vue: État authStore', {
        isAuthenticated: authStore.isAuthenticated,
        user: authStore.user,
        userType: authStore.userType,
        token: !!authStore.token,
        tokenPreview: authStore.token ? authStore.token.substring(0, 20) + '...' : 'null'
      })
      
      // Vérifier l'authentification et le rôle admin
      if (!authStore.isAuthenticated) {
        console.error('❌ Responsable.vue: Non authentifié')
        router.push('/login')
        return
      }
      
      // Vérifier que c'est bien un admin
      const isAdmin = (authStore.user && authStore.user.role === 'ADMIN') || authStore.userType === 'ADMIN'
      console.log('🔐 Vérification admin:', {
        isAdmin,
        userRole: authStore.user?.role,
        userType: authStore.userType
      })
      
      if (!isAdmin) {
        console.error('❌ Responsable.vue: Accès refusé - pas admin')
        router.push('/login')
        return
      }
      
      console.log('✅ Responsable.vue: Accès autorisé')
      console.log('📊 Vue active initiale:', activeView.value)
      
      // Générer le lien parent par défaut
      generateParentLink()
      
      // Charger les données pour la vue active
      if (activeView.value === 'professeurs') {
        console.log('📊 Chargement initial des professeurs...')
        await loadProfesseurs()
      } else if (activeView.value === 'eleves') {
        console.log('📊 Chargement initial des élèves...')
        await loadEleves()
      } else if (activeView.value === 'matieres') {
        console.log('📊 Chargement initial des matières...')
        await loadMatieres()
        await loadClasses()
        await loadProfesseurs()
      } else if (activeView.value === 'notes') {
        console.log('📊 Chargement initial des notes...')
        await loadNotes()
      } else if (activeView.value === 'mes-classes') {
        console.log('📊 Chargement initial des mes classes...')
        await loadMesClasses()
        await loadMesMatieres()
      }
    })

    return {
      authStore, // Exposer authStore pour le template
      user,
      activeView,
      sidebarOpen,
      loading,
      professeurs,
      eleves,
      classes,
      matieres,
      notes,
      selectedFile,
      uploading,
      uploadResult,
      fileInput,
      resettingCode,
      newCodeDisplay,
      showCodeModal,
      showEditProfModal,
      editProfForm,
      // Variables pour l'ajout / modification d'élève
      showAddEleveModal,
      editingEleveId,
      savingEleve,
      eleveForm,
      filieres,
      classesFiltered,
      // Variables pour l'ajout de matière
      showAddMatiereModal,
      savingMatiere,
      matiereForm,
      // Variables pour l'espace élève détaillé
      showEleveDetailsModal,
      selectedEleveForDetails,
      eleveDetailsData,
      loadingEleveDetails,
      // Variables pour la génération de lien parent
      parentAccessLink,
      linkCopied,
      linkInput,
      linkKey,
      // Variables pour "Mes Classes"
      mesClasses,
      mesMatieres,
      selectedClasse,
      selectedMatiere,
      selectedTrimestre,
      elevesWithNotes,
      matieresClasse,
      loadingMesClasses,
      loadingMatieresClasse,
      loadingEleves,
      showAddNoteModal,
      editingNoteId,
      selectedEleve,
      savingNote,
      noteForm,
      matieresDisponibles,
      elevesByClasse,
      matieresByClasse,
      notesByClasse,
      notesByEleve,
      formatDate,
      handleFileSelect,
      resetCode,
      closeCodeModal,
      openEditProfModal,
      closeEditProfModal,
      saveProfesseur,
      copyNewCode,
      handleUpload,
      // Fonctions pour l'ajout d'élève
      openAddEleveModal,
      openEditEleveModal,
      closeAddEleveModal,
      saveEleve,
      onFiliereChange,
      loadFilieres,
      // Fonctions pour l'ajout de matière
      openAddMatiereModal,
      closeAddMatiereModal,
      saveMatiere,
      // Fonctions pour l'espace élève détaillé
      openEleveDetails,
      closeEleveDetailsModal,
      // Fonctions pour la génération de lien parent
      generateParentLink,
      copyLink,
      generateNewLink,
      // Fonctions pour "Mes Classes"
      goToMesClasses,
      setViewAndClose,
      loadMesClasses,
      loadMesMatieres,
      selectClasse,
      selectMatiereForClasse,
      loadElevesWithNotes,
      openAddNoteModal,
      openEditNoteModal,
      closeAddNoteModal,
      saveNote,
      goBackToMesClasses,
      goBackToClasse,
      logout,
      // Fonctions de chargement
      loadProfesseurs,
      loadEleves,
      loadClasses,
      loadMatieres,
      loadNotes
    }
  }
}
</script>

<style scoped>
.responsable-container {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.header {
  flex-shrink: 0;
  background: white;
  padding: 24px 40px 28px;
  min-height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

.header-title {
  flex: 1;
  margin: 0;
  font-size: 1.25rem;
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

.content {
  flex: 1;
  display: flex;
  min-height: 0;
  padding: 20px;
  gap: 20px;
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
  transition: transform 0.3s ease;
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
}

.nav-btn.active {
  background: #3498db;
  color: white;
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

.main-content {
  flex: 1;
  min-width: 0;
  background: white;
  border-radius: 12px;
  padding: 30px;
  overflow: auto;
}

.view h2 {
  margin-bottom: 20px;
  color: #333;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

th {
  background: #3498db;
  color: white;
  font-weight: 600;
}

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.badge-admin {
  background: #dc3545;
  color: white;
}

.badge-prof {
  background: #3498db;
  color: white;
}

.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.classe-card {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
}

.loading, .empty {
  text-align: center;
  padding: 40px;
  color: #666;
}

/* Styles pour l'upload */
.upload-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.upload-info {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.upload-info h3 {
  margin-bottom: 15px;
  color: #333;
}

.upload-info ul {
  margin-left: 20px;
  line-height: 1.8;
}

.upload-info li {
  margin-bottom: 8px;
  color: #555;
}

.upload-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  border: 2px dashed #e0e0e0;
}

.file-input-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-label {
  display: block;
  padding: 20px;
  background: #f5f5f5;
  border: 2px dashed #3498db;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  color: #3498db;
  font-weight: 500;
}

.file-label:hover {
  background: #e8eaf6;
  border-color: #2980b9;
}

.btn-upload {
  width: 100%;
  padding: 14px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-upload:hover:not(:disabled) {
  background: #218838;
}

.btn-upload:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.upload-result {
  background: white;
  padding: 25px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.result-summary {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.result-summary h3 {
  margin-bottom: 15px;
  color: #333;
}

.stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat-item {
  padding: 12px 20px;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 14px;
}

.stat-item.success {
  background: #d4edda;
  color: #155724;
}

.stat-item.error {
  background: #f8d7da;
  color: #721c24;
}

.result-section {
  margin-top: 20px;
}

.result-section h4 {
  margin-bottom: 15px;
  font-size: 18px;
}

.success-section h4 {
  color: #28a745;
}

.error-section h4 {
  color: #dc3545;
}

.code-secret {
  color: #3498db;
  font-family: monospace;
  font-size: 16px;
  letter-spacing: 1px;
}

.errors-list {
  background: #fff5f5;
  padding: 15px;
  border-radius: 6px;
  border-left: 4px solid #dc3545;
}

.error-item {
  padding: 8px 0;
  color: #721c24;
  font-size: 14px;
}

.btn-reset-code {
  padding: 6px 12px;
  background: #ffc107;
  color: #333;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-reset-code:hover:not(:disabled) {
  background: #e0a800;
}

.btn-reset-code:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reset-icon {
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
}

.btn-edit-prof {
  padding: 6px 12px;
  margin-right: 8px;
  background: #17a2b8;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-edit-prof:hover {
  background: #138496;
}

.btn-edit-eleve {
  padding: 6px 12px;
  background: #17a2b8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}
.btn-edit-eleve:hover {
  background: #138496;
}

.success-icon-inline,
.warning-icon-inline {
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
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
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5rem;
}

.modal-content {
  text-align: center;
}

.modal-content p {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.1rem;
}

.code-box {
  background: #f8f9fa;
  border: 3px solid #3498db;
  border-radius: 12px;
  padding: 25px;
  margin: 25px 0;
}

.code-label {
  color: #333;
  font-weight: 600;
  margin-bottom: 15px;
  font-size: 1rem;
}

.code-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #3498db;
  letter-spacing: 3px;
  font-family: 'Courier New', monospace;
  padding: 15px;
  background: white;
  border-radius: 8px;
  display: inline-block;
  min-width: 250px;
  word-break: break-all;
}

.code-warning {
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 12px;
  padding: 15px;
  margin: 20px 0;
  text-align: left;
}

.code-warning strong {
  color: #856404;
  display: block;
  margin-bottom: 8px;
}

.code-warning p {
  color: #856404;
  margin: 5px 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;
}

.btn-copy {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-copy:hover {
  background: #5a6268;
}

.btn-close {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-close:hover {
  background: #2980b9;
}

/* Styles pour "Mes Classes" */
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
  transition: background 0.3s;
}

.btn-back:hover {
  background: #5a6268;
}

.classe-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.classe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.matieres-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.matiere-card {
  background: #f8f9fa;
  padding: 18px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.matiere-card-text {
  position: relative;
  padding-left: 12px;
}

.matiere-card-text::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #3498db;
  border-radius: 0 2px 2px 0;
}

.matiere-card:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.btn-icon {
  background: #3498db;
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

.notes-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background: white;
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
}

.section-header {
  background: #2980b9 !important;
  font-weight: 700;
}

.notes-table td {
  padding: 10px 8px;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.notes-table tbody tr:hover {
  background: #f8f9fa;
}

.notes-table tbody tr:nth-child(even) {
  background: #fafafa;
}

.notes-table tbody tr:nth-child(even):hover {
  background: #f0f0f0;
}

.note-cell {
  min-width: 60px;
  font-weight: 500;
  color: #333;
}
.note-cell.clickable {
  cursor: pointer;
}

.moyenne-cell {
  font-weight: 600;
  color: #3498db;
}

.moyenne-cell.no-data {
  color: #999;
  font-weight: normal;
}

.coeff-cell {
  font-weight: 600;
  color: #333;
}

.btn-add-note {
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-add-note:hover {
  background: #218838;
}

/* Styles pour le formulaire de la modale */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-group .required {
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

.btn-cancel {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-cancel:hover {
  background: #5a6268;
}

.btn-save {
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-save:hover:not(:disabled) {
  background: #218838;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Styles pour le bouton d'ajout de matière */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.btn-add-matiere {
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}

.btn-add-matiere:hover {
  background: #218838;
}

.btn-icon-inline {
  display: inline-block;
  vertical-align: middle;
}

/* Styles pour les sections groupées par classe */
.classe-section {
  margin-bottom: 40px;
}

.classe-section:last-child {
  margin-bottom: 0;
}

.classe-title {
  display: inline-block;
  width: fit-content;
  background: #93c9a8;
  color: #1a4d2e;
  padding: 12px 20px;
  margin: 0 0 15px 0;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* En-têtes des tableaux Élèves, Matières, Toutes les Notes (différent des bandeaux classe) */
.classe-section .table-section thead {
  background: #3498db;
  color: white;
}

.classe-section .table-section th {
  background: #3498db;
  color: white;
}

/* Styles pour les boutons d'élève */
.btn-eleve-name {
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
  padding: 0;
  font-size: inherit;
}

.btn-eleve-name:hover {
  color: #2980b9;
}

.btn-view-details {
  padding: 6px 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-view-details:hover {
  background: #2980b9;
}

/* Styles pour la génération de lien parent */
.link-generation-card {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 12px;
  max-width: 800px;
  margin: 0 auto;
}

.link-info {
  margin-bottom: 30px;
}

.info-text {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px;
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  border-radius: 8px;
  color: #1565c0;
  line-height: 1.6;
}

.info-icon {
  color: #2196f3;
  flex-shrink: 0;
  margin-top: 2px;
}

.link-section {
  margin-bottom: 25px;
}

.link-section label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #333;
  font-size: 15px;
}

.link-input-group {
  display: flex;
  gap: 10px;
  align-items: stretch;
}

.link-input {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  color: #333;
  font-family: monospace;
}

.link-input:focus {
  outline: none;
  border-color: #3498db;
}

.link-open-text {
  margin: 12px 0 0 0;
  font-size: 14px;
  color: #555;
}

.link-clickable {
  color: #3498db;
  font-weight: 600;
  text-decoration: underline;
  word-break: break-all;
}

.link-clickable:hover {
  color: #2980b9;
}

.btn-copy-link {
  padding: 12px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-copy-link:hover {
  background: #2980b9;
}

.btn-copy-link.copied {
  background: #28a745;
}

.btn-copy-link.copied:hover {
  background: #218838;
}

.link-actions {
  margin-bottom: 30px;
}

.btn-generate {
  padding: 12px 24px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}

.btn-generate:hover {
  background: #5a6268;
}

.link-instructions {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.link-instructions h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
}

.link-instructions ol {
  margin: 0;
  padding-left: 20px;
  color: #555;
  line-height: 1.8;
}

.link-instructions li {
  margin-bottom: 8px;
}

/* Styles pour la modale élève détaillée */
.modal-large {
  z-index: 2000;
}

.modal-large-content {
  max-width: 95%;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.btn-close-modal {
  background: none;
  border: none;
  font-size: 28px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.btn-close-modal:hover {
  background: #f5f5f5;
  color: #333;
}

.eleve-details-content {
  padding: 10px 0;
}

.eleve-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 25px;
}

.eleve-info p {
  margin: 5px 0;
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
  font-size: 20px;
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
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  padding: 8px 12px;
  background: #e9ecef;
  border-radius: 6px;
  display: inline-block;
}

.notes-detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  background: white;
}

.notes-detail-table thead {
  background: #3498db;
  color: white;
}

.notes-detail-table th {
  padding: 10px 6px;
  text-align: center;
  font-weight: 600;
  border: 1px solid rgba(255,255,255,0.2);
  font-size: 12px;
}

.notes-detail-table td {
  padding: 8px 6px;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.notes-detail-table tbody tr:hover {
  background: #f8f9fa;
}

/* Styles pour le bouton d'ajout d'élève */
.btn-add-eleve {
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}

.btn-add-eleve:hover {
  background: #218838;
}

/* Styles pour le formulaire d'ajout d'élève */
.form-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  border-radius: 6px;
  color: #1565c0;
  font-size: 14px;
  margin-bottom: 20px;
}

.info-icon-small {
  color: #2196f3;
  flex-shrink: 0;
}

.form-hint {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #999;
  font-style: italic;
}
</style>
