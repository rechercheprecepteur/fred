const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const config = require('../config');
const { authenticateToken } = require('../middleware/auth');
const { precepteursDB, usersDB } = require('../utils/database');

const router = express.Router();

// ============ HELPERS ============

// Helper pour initialiser les différentes DB
async function getDB(filename) {
  const { JSONDatabase } = require('../utils/database');
  const db = new JSONDatabase(filename);
  await db.init();
  return db;
}

// Configuration multer pour les fichiers de session
const sessionFileStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const sessionId = req.params.id;
      const uploadDir = path.join(config.uploadPath, 'sessions', String(sessionId));
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, '');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `session-file-${uniqueSuffix}${ext}`);
  }
});

const sessionFileUpload = multer({
  storage: sessionFileStorage,
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'video/mp4', 'video/avi', 'video/mov',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Type de fichier non autorisé: ${file.mimetype}`), false);
    }
  }
});

// ============ ROUTES SESSIONS ============

/**
 * 🟢 RÉCUPÉRER TOUTES LES SESSIONS D'UN PRÉCEPTEUR
 * GET /api/sessions
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Vérifier que c'est un précepteur
    if (req.user.role !== 'precepteur') {
      return res.status(403).json({ 
        success: false, 
        error: 'Accès réservé aux précepteurs' 
      });
    }

    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur) {
      return res.json({ success: true, sessions: [] });
    }

    // Récupérer les contrats du précepteur
    const contractsDB = await getDB('contracts.json');
    const allContracts = await contractsDB.findAll();
    const mesContrats = allContracts.filter(c => 
      String(c.precepteur_id) === String(precepteur.id)
    );

    if (mesContrats.length === 0) {
      return res.json({ success: true, sessions: [] });
    }

    // Récupérer toutes les sessions
    const sessionsDB = await getDB('sessions_cours.json');
    let allSessions = [];
    
    try {
      allSessions = await sessionsDB.findAll();
    } catch (err) {
      // Si le fichier n'existe pas encore
      return res.json({ success: true, sessions: [] });
    }

    // Filtrer les sessions des contrats du précepteur
    const contratIds = mesContrats.map(c => c.id);
    const sessions = allSessions.filter(s => 
      contratIds.includes(Number(s.contract_id)) || contratIds.includes(String(s.contract_id))
    );

    // Trier par date (plus récent d'abord)
    sessions.sort((a, b) => new Date(b.date_session || b.created_at).getTime() - new Date(a.date_session || a.created_at).getTime());

    // Enrichir avec les infos des contrats, élèves et matières
    const elevesDB = await getDB('eleves.json');
    const matieresDB = await getDB('matieres.json');
    const allEleves = await elevesDB.findAll();
    const allMatieres = await matieresDB.findAll();

    const enriched = await Promise.all(sessions.map(async (session) => {
      const contrat = mesContrats.find(c => 
        String(c.id) === String(session.contract_id)
      );

      let eleveInfo = null;
      let matiereInfo = null;
      let parentInfo = null;

      if (contrat) {
        // Récupérer l'élève
        if (contrat.eleve_id) {
          eleveInfo = allEleves.find(e => String(e.id) === String(contrat.eleve_id)) || null;
        }

        // Récupérer la matière
        if (contrat.matiere_id) {
          matiereInfo = allMatieres.find(m => String(m.id) === String(contrat.matiere_id)) || null;
        }

        // Récupérer le parent
        if (contrat.parent_id) {
          const parentsDB = await getDB('parents.json');
          const parent = await parentsDB.findById(contrat.parent_id);
          if (parent) {
            const parentUser = await usersDB.findById(parent.user_id);
            if (parentUser) {
              const { password, verification_code, verification_code_expires, reset_token, reset_token_expires, ...cleanParent } = parentUser;
              parentInfo = {
                id: parent.id,
                telephone: parent.telephone,
                adresse: parent.adresse,
                commune: parent.commune,
                user: cleanParent
              };
            }
          }
        }
      }

      // Récupérer les fichiers
      const sessionFilesDB = await getDB('session_files.json');
      let files = [];
      try {
        files = await sessionFilesDB.findAll({ session_id: session.id });
      } catch (err) {
        // Pas de fichiers
      }

      // Récupérer les cotations
      const sessionGradesDB = await getDB('session_grades.json');
      let grades = [];
      try {
        grades = await sessionGradesDB.findAll({ session_id: session.id });
      } catch (err) {
        // Pas de cotations
      }

      return {
        id: session.id,
        contract_id: session.contract_id,
        date_session: session.date_session,
        heure_debut: session.heure_debut,
        heure_fin: session.heure_fin,
        duree_minutes: session.duree_minutes,
        statut: session.statut || 'planifie',
        type_session: session.type_session || 'presentiel',
        lieu: session.lieu || null,
        lien_visio: session.lien_visio || null,
        notes_precepteur: session.notes_precepteur || null,
        notes_parent: session.notes_parent || null,
        feedback_precepteur: session.feedback_precepteur || null,
        feedback_parent: session.feedback_parent || null,
        note_session: session.note_session || null,
        raison_annulation: session.raison_annulation || null,
        annule_par: session.annule_par || null,
        created_at: session.created_at,
        updated_at: session.updated_at,
        contrat: contrat ? {
          id: contrat.id,
          type_contrat: contrat.type_contrat,
          frequence: contrat.frequence,
          tarif_horaire: contrat.tarif_horaire,
          statut: contrat.statut
        } : null,
        eleve: eleveInfo,
        matiere: matiereInfo,
        parent: parentInfo,
        files: files,
        grades: grades,
        files_count: files.length,
        grades_count: grades.length
      };
    }));

    console.log(`✅ ${enriched.length} sessions enrichies pour précepteur ${precepteur.id}`);
    
    res.json({ 
      success: true, 
      sessions: enriched,
      total: enriched.length 
    });

  } catch (error) {
    console.error('❌ Erreur récupération sessions:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de la récupération des sessions' 
    });
  }
});

/**
 * 🟢 RÉCUPÉRER LES SESSIONS D'UN CONTRAT SPÉCIFIQUE
 * GET /api/sessions/contract/:contractId
 */
router.get('/contract/:contractId', authenticateToken, async (req, res) => {
  try {
    const contractId = req.params.contractId;

    // Vérifier que l'utilisateur a accès à ce contrat
    if (req.user.role === 'precepteur') {
      const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
      if (!precepteur) {
        return res.status(403).json({ success: false, error: 'Précepteur non trouvé' });
      }

      const contractsDB = await getDB('contracts.json');
      const contrat = await contractsDB.findById(contractId);
      
      if (!contrat || String(contrat.precepteur_id) !== String(precepteur.id)) {
        return res.status(403).json({ success: false, error: 'Accès non autorisé à ce contrat' });
      }
    }

    const sessionsDB = await getDB('sessions_cours.json');
    let sessions = [];
    
    try {
      const allSessions = await sessionsDB.findAll();
      sessions = allSessions.filter(s => 
        String(s.contract_id) === String(contractId)
      );
    } catch (err) {
      return res.json({ success: true, sessions: [] });
    }

    // Trier par date
    sessions.sort((a, b) => 
      new Date(b.date_session || b.created_at).getTime() - new Date(a.date_session || a.created_at).getTime()
    );

    // Enrichir avec les fichiers et cotations
    const sessionFilesDB = await getDB('session_files.json');
    const sessionGradesDB = await getDB('session_grades.json');

    const enriched = await Promise.all(sessions.map(async (session) => {
      let files = [];
      let grades = [];
      
      try {
        files = await sessionFilesDB.findAll({ session_id: session.id });
      } catch (err) {}
      
      try {
        grades = await sessionGradesDB.findAll({ session_id: session.id });
      } catch (err) {}

      return {
        ...session,
        files,
        grades,
        files_count: files.length,
        grades_count: grades.length
      };
    }));

    console.log(`✅ ${enriched.length} sessions pour contrat ${contractId}`);
    
    res.json({ 
      success: true, 
      sessions: enriched 
    });

  } catch (error) {
    console.error('❌ Erreur récupération sessions contrat:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur serveur' 
    });
  }
});

/**
 * 🟢 RÉCUPÉRER UNE SESSION PAR ID
 * GET /api/sessions/:id
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const sessionId = req.params.id;

    const sessionsDB = await getDB('sessions_cours.json');
    const session = await sessionsDB.findById(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session non trouvée' });
    }

    // Enrichir avec fichiers et cotations
    const sessionFilesDB = await getDB('session_files.json');
    const sessionGradesDB = await getDB('session_grades.json');

    let files = [];
    let grades = [];

    try {
      files = await sessionFilesDB.findAll({ session_id: session.id });
    } catch (err) {}

    try {
      grades = await sessionGradesDB.findAll({ session_id: session.id });
    } catch (err) {}

    res.json({
      success: true,
      session: {
        ...session,
        files,
        grades,
        files_count: files.length,
        grades_count: grades.length
      }
    });

  } catch (error) {
    console.error('❌ Erreur récupération session:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur serveur' 
    });
  }
});

/**
 * 🟢 CRÉER UNE SESSION
 * POST /api/sessions
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'precepteur') {
      return res.status(403).json({ 
        success: false, 
        error: 'Accès réservé aux précepteurs' 
      });
    }

    const { 
      contract_id, 
      date_session, 
      heure_debut, 
      heure_fin, 
      lieu, 
      notes_precepteur,
      type_session = 'presentiel',
      lien_visio = null
    } = req.body;

    // Validation
    if (!contract_id || !date_session || !heure_debut || !heure_fin || !lieu) {
      return res.status(400).json({ 
        success: false, 
        error: 'Tous les champs obligatoires sont requis : contract_id, date_session, heure_debut, heure_fin, lieu' 
      });
    }

    // Vérifier que le contrat appartient au précepteur
    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur) {
      return res.status(404).json({ success: false, error: 'Précepteur non trouvé' });
    }

    const contractsDB = await getDB('contracts.json');
    const contrat = await contractsDB.findById(contract_id);

    if (!contrat) {
      return res.status(404).json({ success: false, error: 'Contrat non trouvé' });
    }

    if (String(contrat.precepteur_id) !== String(precepteur.id)) {
      return res.status(403).json({ success: false, error: 'Ce contrat ne vous appartient pas' });
    }

    // Vérifier que le contrat est actif
    if (contrat.statut !== 'actif' && contrat.statut !== 'accepte') {
      return res.status(400).json({ 
        success: false, 
        error: 'Le contrat doit être actif pour créer une session' 
      });
    }

    // Calculer la durée
    const [hDeb, mDeb] = heure_debut.split(':').map(Number);
    const [hFin, mFin] = heure_fin.split(':').map(Number);
    const dureeMinutes = (hFin * 60 + mFin) - (hDeb * 60 + mDeb);

    if (dureeMinutes < 30) {
      return res.status(400).json({ 
        success: false, 
        error: 'La durée minimale est de 30 minutes' 
      });
    }

    // Vérifier que la date est dans la période du contrat
    const dateSession = new Date(date_session);
    dateSession.setHours(0, 0, 0, 0);
    
    const dateDebut = new Date(contrat.date_debut);
    dateDebut.setHours(0, 0, 0, 0);
    
    const dateFin = new Date(contrat.date_fin);
    dateFin.setHours(0, 0, 0, 0);

    if (dateSession < dateDebut || dateSession > dateFin) {
      return res.status(400).json({ 
        success: false, 
        error: `La date doit être entre le ${dateDebut.toLocaleDateString('fr-FR')} et le ${dateFin.toLocaleDateString('fr-FR')}` 
      });
    }

    // Vérifier les conflits d'horaires
    const sessionsDB = await getDB('sessions_cours.json');
    let allSessions = [];
    try {
      allSessions = await sessionsDB.findAll();
    } catch (err) {}

    const conflit = allSessions.find(s => 
      String(s.contract_id) === String(contract_id) &&
      s.date_session === date_session &&
      s.statut !== 'annule' &&
      (
        (heure_debut >= s.heure_debut && heure_debut < s.heure_fin) ||
        (heure_fin > s.heure_debut && heure_fin <= s.heure_fin) ||
        (heure_debut <= s.heure_debut && heure_fin >= s.heure_fin)
      )
    );

    if (conflit) {
      return res.status(409).json({ 
        success: false, 
        error: `Conflit d'horaire : une session existe déjà le ${date_session} de ${conflit.heure_debut} à ${conflit.heure_fin}` 
      });
    }

    // Créer la session
    const session = await sessionsDB.create({
      contract_id: Number(contract_id),
      date_session,
      heure_debut,
      heure_fin,
      duree_minutes: dureeMinutes,
      statut: 'planifie',
      type_session: type_session || 'presentiel',
      lieu: lieu || null,
      lien_visio: lien_visio || null,
      notes_precepteur: notes_precepteur || null,
      notes_parent: null,
      feedback_precepteur: null,
      feedback_parent: null,
      note_session: null,
      raison_annulation: null,
      annule_par: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    console.log(`✅ Session créée: ${session.id} pour contrat ${contract_id}`);

    res.status(201).json({ 
      success: true, 
      session,
      message: 'Session planifiée avec succès' 
    });

  } catch (error) {
    console.error('❌ Erreur création session:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de la création de la session' 
    });
  }
});

/**
 * 🟢 METTRE À JOUR LE STATUT D'UNE SESSION
 * PATCH /api/sessions/:id/status
 */
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { statut, raison_annulation } = req.body;

    const validStatuses = ['planifie', 'en_cours', 'termine', 'annule', 'reporte'];
    if (!validStatuses.includes(statut)) {
      return res.status(400).json({ 
        success: false, 
        error: `Statut invalide. Valides: ${validStatuses.join(', ')}` 
      });
    }

    const sessionsDB = await getDB('sessions_cours.json');
    const session = await sessionsDB.findById(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session non trouvée' });
    }

    // Vérifier les permissions
    if (req.user.role === 'precepteur') {
      const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
      const contractsDB = await getDB('contracts.json');
      const contrat = await contractsDB.findById(session.contract_id);
      
      if (!contrat || String(contrat.precepteur_id) !== String(precepteur.id)) {
        return res.status(403).json({ success: false, error: 'Non autorisé' });
      }
    }

    // Valider les transitions de statut
    const transitionsValides = {
      'planifie': ['en_cours', 'annule'],
      'en_cours': ['termine', 'annule'],
      'termine': ['en_cours'], // Réouverture
      'annule': ['planifie'], // Réactivation
      'reporte': ['planifie', 'annule']
    };

    const statutActuel = session.statut;
    if (!transitionsValides[statutActuel]?.includes(statut)) {
      return res.status(400).json({ 
        success: false, 
        error: `Transition invalide: ${statutActuel} → ${statut}` 
      });
    }

    const updates = {
      statut,
      updated_at: new Date().toISOString()
    };

    if (statut === 'annule') {
      updates.raison_annulation = raison_annulation || null;
      updates.annule_par = req.user.role;
    }

    await sessionsDB.update(sessionId, updates);

    console.log(`✅ Session ${sessionId}: ${statutActuel} → ${statut}`);

    res.json({ 
      success: true, 
      message: `Session ${statut.replace('_', ' ')} avec succès` 
    });

  } catch (error) {
    console.error('❌ Erreur mise à jour statut session:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur serveur' 
    });
  }
});

/**
 * 🟢 METTRE À JOUR LES NOTES D'UNE SESSION
 * PUT /api/sessions/:id/notes
 */
router.put('/:id/notes', authenticateToken, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { notes_precepteur, feedback_precepteur } = req.body;

    const sessionsDB = await getDB('sessions_cours.json');
    const session = await sessionsDB.findById(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session non trouvée' });
    }

    // Vérifier les permissions
    if (req.user.role === 'precepteur') {
      const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
      const contractsDB = await getDB('contracts.json');
      const contrat = await contractsDB.findById(session.contract_id);
      
      if (!contrat || String(contrat.precepteur_id) !== String(precepteur.id)) {
        return res.status(403).json({ success: false, error: 'Non autorisé' });
      }
    }

    const updates = {
      updated_at: new Date().toISOString()
    };

    if (notes_precepteur !== undefined) {
      updates.notes_precepteur = notes_precepteur;
    }
    if (feedback_precepteur !== undefined) {
      updates.feedback_precepteur = feedback_precepteur;
    }

    await sessionsDB.update(sessionId, updates);

    console.log(`✅ Notes mises à jour pour session ${sessionId}`);

    res.json({ success: true, message: 'Notes sauvegardées avec succès' });

  } catch (error) {
    console.error('❌ Erreur mise à jour notes:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur serveur' 
    });
  }
});

/**
 * 🟢 METTRE À JOUR UNE SESSION COMPLÈTE
 * PUT /api/sessions/:id
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const updates = req.body;

    const sessionsDB = await getDB('sessions_cours.json');
    const session = await sessionsDB.findById(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session non trouvée' });
    }

    // Vérifier les permissions
    if (req.user.role === 'precepteur') {
      const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
      const contractsDB = await getDB('contracts.json');
      const contrat = await contractsDB.findById(session.contract_id);
      
      if (!contrat || String(contrat.precepteur_id) !== String(precepteur.id)) {
        return res.status(403).json({ success: false, error: 'Non autorisé' });
      }
    }

    // Empêcher la modification de certains champs
    delete updates.id;
    delete updates.contract_id;
    delete updates.created_at;

    updates.updated_at = new Date().toISOString();

    await sessionsDB.update(sessionId, updates);

    console.log(`✅ Session ${sessionId} mise à jour`);

    res.json({ success: true, message: 'Session mise à jour avec succès' });

  } catch (error) {
    console.error('❌ Erreur mise à jour session:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur serveur' 
    });
  }
});

/**
 * 🟢 SUPPRIMER UNE SESSION
 * DELETE /api/sessions/:id
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const sessionId = req.params.id;

    const sessionsDB = await getDB('sessions_cours.json');
    const session = await sessionsDB.findById(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session non trouvée' });
    }

    // Vérifier les permissions
    if (req.user.role === 'precepteur') {
      const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
      const contractsDB = await getDB('contracts.json');
      const contrat = await contractsDB.findById(session.contract_id);
      
      if (!contrat || String(contrat.precepteur_id) !== String(precepteur.id)) {
        return res.status(403).json({ success: false, error: 'Non autorisé' });
      }
    }

    // Seules les sessions planifiées peuvent être supprimées
    if (session.statut !== 'planifie' && session.statut !== 'annule') {
      return res.status(400).json({ 
        success: false, 
        error: 'Seules les sessions planifiées ou annulées peuvent être supprimées' 
      });
    }

    // Supprimer les fichiers associés
    const sessionFilesDB = await getDB('session_files.json');
    let files = [];
    try {
      files = await sessionFilesDB.findAll({ session_id: session.id });
    } catch (err) {}

    for (const file of files) {
      if (file.file_path) {
        const filePath = path.join(config.uploadPath, '..', file.file_path);
        await fs.unlink(filePath).catch(() => {});
      }
      await sessionFilesDB.delete(file.id).catch(() => {});
    }

    // Supprimer les cotations
    const sessionGradesDB = await getDB('session_grades.json');
    let grades = [];
    try {
      grades = await sessionGradesDB.findAll({ session_id: session.id });
    } catch (err) {}

    for (const grade of grades) {
      await sessionGradesDB.delete(grade.id).catch(() => {});
    }

    // Supprimer la session
    await sessionsDB.delete(sessionId);

    console.log(`✅ Session ${sessionId} supprimée avec ${files.length} fichiers et ${grades.length} cotations`);

    res.json({ success: true, message: 'Session supprimée avec succès' });

  } catch (error) {
    console.error('❌ Erreur suppression session:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur serveur' 
    });
  }
});

// ============ ROUTES FICHIERS DE SESSION ============

/**
 * 🟢 UPLOADER UN FICHIER
 * POST /api/sessions/:id/files
 */
router.post('/:id/files', authenticateToken, sessionFileUpload.single('fichier'), async (req, res) => {
  try {
    const sessionId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Aucun fichier fourni' });
    }

    // Vérifier que la session existe et appartient au précepteur
    const sessionsDB = await getDB('sessions_cours.json');
    const session = await sessionsDB.findById(sessionId);

    if (!session) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(404).json({ success: false, error: 'Session non trouvée' });
    }

    if (req.user.role === 'precepteur') {
      const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
      const contractsDB = await getDB('contracts.json');
      const contrat = await contractsDB.findById(session.contract_id);
      
      if (!contrat || String(contrat.precepteur_id) !== String(precepteur.id)) {
        await fs.unlink(req.file.path).catch(() => {});
        return res.status(403).json({ success: false, error: 'Non autorisé' });
      }
    }

    // Déterminer le type de fichier
    let fileType = 'other';
    if (req.file.mimetype.startsWith('image/')) fileType = 'image';
    else if (req.file.mimetype === 'application/pdf') fileType = 'pdf';
    else if (req.file.mimetype.startsWith('video/')) fileType = 'video';
    else if (req.file.mimetype.includes('document') || req.file.mimetype.includes('word') || req.file.mimetype.includes('text')) fileType = 'document';

    // Construire le chemin relatif
    const relativePath = `/uploads/sessions/${sessionId}/${req.file.filename}`;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fullUrl = `${baseUrl}${relativePath}`;

    const sessionFilesDB = await getDB('session_files.json');
    const file = await sessionFilesDB.create({
      session_id: Number(sessionId),
      file_name: req.file.originalname,
      file_path: relativePath,
      file_url: fullUrl,
      file_type: fileType,
      file_size: req.file.size,
      uploaded_by: req.user.role,
      created_at: new Date().toISOString()
    });

    console.log(`✅ Fichier uploadé pour session ${sessionId}: ${req.file.originalname}`);

    res.status(201).json({ 
      success: true, 
      file,
      url: fullUrl,
      message: 'Fichier uploadé avec succès' 
    });

  } catch (error) {
    console.error('❌ Erreur upload fichier session:', error);
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur serveur' 
    });
  }
});

/**
 * 🟢 RÉCUPÉRER LES FICHIERS D'UNE SESSION
 * GET /api/sessions/:id/files
 */
router.get('/:id/files', authenticateToken, async (req, res) => {
  try {
    const sessionId = req.params.id;

    const sessionFilesDB = await getDB('session_files.json');
    let files = [];
    
    try {
      files = await sessionFilesDB.findAll({ session_id: Number(sessionId) });
    } catch (err) {
      return res.json({ success: true, files: [] });
    }

    // Trier par date
    files.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({ success: true, files, total: files.length });

  } catch (error) {
    console.error('❌ Erreur récupération fichiers:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur serveur' 
    });
  }
});

/**
 * 🟢 TÉLÉCHARGER UN FICHIER
 * GET /api/sessions/files/:fileId/download
 */
router.get('/files/:fileId/download', authenticateToken, async (req, res) => {
  try {
    const fileId = req.params.fileId;

    const sessionFilesDB = await getDB('session_files.json');
    const file = await sessionFilesDB.findById(fileId);

    if (!file) {
      return res.status(404).json({ success: false, error: 'Fichier non trouvé' });
    }

    const filePath = path.join(config.uploadPath, '..', file.file_path);
    
    // Vérifier que le fichier existe
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ success: false, error: 'Fichier physique non trouvé' });
    }

    res.download(filePath, file.file_name);

  } catch (error) {
    console.error('❌ Erreur téléchargement fichier:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur serveur' 
    });
  }
});

/**
 * 🟢 SUPPRIMER UN FICHIER
 * DELETE /api/sessions/files/:fileId
 */
router.delete('/files/:fileId', authenticateToken, async (req, res) => {
  try {
    const fileId = req.params.fileId;

    const sessionFilesDB = await getDB('session_files.json');
    const file = await sessionFilesDB.findById(fileId);

    if (!file) {
      return res.status(404).json({ success: false, error: 'Fichier non trouvé' });
    }

    // Supprimer le fichier physique
    if (file.file_path) {
      const filePath = path.join(config.uploadPath, '..', file.file_path);
      await fs.unlink(filePath).catch(err => {
        console.warn('⚠️ Impossible de supprimer le fichier physique:', err.message);
      });
    }

    await sessionFilesDB.delete(fileId);

    console.log(`✅ Fichier ${fileId} supprimé`);

    res.json({ success: true, message: 'Fichier supprimé avec succès' });

  } catch (error) {
    console.error('❌ Erreur suppression fichier:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur serveur' 
    });
  }
});

// ============ ROUTES COTATIONS ============

/**
 * 🟢 AJOUTER UNE COTATION
 * POST /api/sessions/:id/grades
 */
router.post('/:id/grades', authenticateToken, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { titre, score, max_score, comment } = req.body;

    if (!titre || score === undefined || max_score === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Titre, score et max_score sont requis' 
      });
    }

    // Vérifier que la session existe
    const sessionsDB = await getDB('sessions_cours.json');
    const session = await sessionsDB.findById(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session non trouvée' });
    }

    // Vérifier les permissions
    if (req.user.role === 'precepteur') {
      const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
      const contractsDB = await getDB('contracts.json');
      const contrat = await contractsDB.findById(session.contract_id);
      
      if (!contrat || String(contrat.precepteur_id) !== String(precepteur.id)) {
        return res.status(403).json({ success: false, error: 'Non autorisé' });
      }
    }

    const sessionGradesDB = await getDB('session_grades.json');

    const grade = await sessionGradesDB.create({
      session_id: Number(sessionId),
      titre: titre.trim(),
      score: parseFloat(score),
      max_score: parseFloat(max_score),
      comment: comment?.trim() || null,
      created_at: new Date().toISOString()
    });

    console.log(`✅ Cotation ajoutée pour session ${sessionId}: ${titre} (${score}/${max_score})`);

    res.status(201).json({ 
      success: true, 
      grade,
      message: 'Cotation ajoutée avec succès' 
    });

  } catch (error) {
    console.error('❌ Erreur ajout cotation:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur serveur' 
    });
  }
});

/**
 * 🟢 RÉCUPÉRER LES COTATIONS D'UNE SESSION
 * GET /api/sessions/:id/grades
 */
router.get('/:id/grades', authenticateToken, async (req, res) => {
  try {
    const sessionId = req.params.id;

    const sessionGradesDB = await getDB('session_grades.json');
    let grades = [];
    
    try {
      grades = await sessionGradesDB.findAll({ session_id: Number(sessionId) });
    } catch (err) {
      return res.json({ success: true, grades: [] });
    }

    // Trier par date
    grades.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Calculer la moyenne
    let moyenne = 0;
    if (grades.length > 0) {
      const total = grades.reduce((acc, g) => acc + (g.score / g.max_score) * 20, 0);
      moyenne = total / grades.length;
    }

    res.json({ 
      success: true, 
      grades, 
      total: grades.length,
      moyenne: Math.round(moyenne * 10) / 10
    });

  } catch (error) {
    console.error('❌ Erreur récupération cotations:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur serveur' 
    });
  }
});

/**
 * 🟢 MODIFIER UNE COTATION
 * PUT /api/sessions/grades/:gradeId
 */
router.put('/grades/:gradeId', authenticateToken, async (req, res) => {
  try {
    const gradeId = req.params.gradeId;
    const { titre, score, max_score, comment } = req.body;

    const sessionGradesDB = await getDB('session_grades.json');
    const grade = await sessionGradesDB.findById(gradeId);

    if (!grade) {
      return res.status(404).json({ success: false, error: 'Cotation non trouvée' });
    }

    const updates = {};

    if (titre !== undefined) updates.titre = titre.trim();
    if (score !== undefined) updates.score = parseFloat(score);
    if (max_score !== undefined) updates.max_score = parseFloat(max_score);
    if (comment !== undefined) updates.comment = comment?.trim() || null;

    await sessionGradesDB.update(gradeId, updates);

    console.log(`✅ Cotation ${gradeId} modifiée`);

    res.json({ success: true, message: 'Cotation modifiée avec succès' });

  } catch (error) {
    console.error('❌ Erreur modification cotation:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur serveur' 
    });
  }
});

/**
 * 🟢 SUPPRIMER UNE COTATION
 * DELETE /api/sessions/grades/:gradeId
 */
router.delete('/grades/:gradeId', authenticateToken, async (req, res) => {
  try {
    const gradeId = req.params.gradeId;

    const sessionGradesDB = await getDB('session_grades.json');
    const grade = await sessionGradesDB.findById(gradeId);

    if (!grade) {
      return res.status(404).json({ success: false, error: 'Cotation non trouvée' });
    }

    await sessionGradesDB.delete(gradeId);

    console.log(`✅ Cotation ${gradeId} supprimée`);

    res.json({ success: true, message: 'Cotation supprimée avec succès' });

  } catch (error) {
    console.error('❌ Erreur suppression cotation:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur serveur' 
    });
  }
});

// ============ STATISTIQUES ============

/**
 * 🟢 STATISTIQUES DES SESSIONS
 * GET /api/sessions/stats/overview
 */
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'precepteur') {
      return res.status(403).json({ success: false, error: 'Accès réservé aux précepteurs' });
    }

    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur) {
      return res.json({ success: true, stats: {} });
    }

    const contractsDB = await getDB('contracts.json');
    const sessionsDB = await getDB('sessions_cours.json');

    const allContracts = await contractsDB.findAll();
    const mesContrats = allContracts.filter(c => 
      String(c.precepteur_id) === String(precepteur.id)
    );

    let allSessions = [];
    try {
      allSessions = await sessionsDB.findAll();
    } catch (err) {}

    const contratIds = mesContrats.map(c => c.id);
    const mesSessions = allSessions.filter(s => 
      contratIds.includes(Number(s.contract_id)) || contratIds.includes(String(s.contract_id))
    );

    const stats = {
      total: mesSessions.length,
      planifiees: mesSessions.filter(s => s.statut === 'planifie').length,
      en_cours: mesSessions.filter(s => s.statut === 'en_cours').length,
      terminees: mesSessions.filter(s => s.statut === 'termine').length,
      annulees: mesSessions.filter(s => s.statut === 'annule').length,
      reportees: mesSessions.filter(s => s.statut === 'reporte').length,
      total_minutes: mesSessions.reduce((acc, s) => acc + (s.duree_minutes || 0), 0),
      total_heures: Math.round(mesSessions.reduce((acc, s) => acc + (s.duree_minutes || 0), 0) / 60 * 10) / 10
    };

    res.json({ success: true, stats });

  } catch (error) {
    console.error('❌ Erreur statistiques:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

module.exports = router;