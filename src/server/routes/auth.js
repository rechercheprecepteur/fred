const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const config = require('../config');
const { usersDB, precepteursDB } = require('../utils/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configuration multer pour les uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(config.uploadPath, 'profils');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
// Configuration multer pour les uploads - 10 MB max
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // ✅ 10 MB
    files: 1 // Un seul fichier à la fois
  },
  fileFilter: (req, file, cb) => {
    console.log('📁 Multer fileFilter:', file.mimetype, 'Taille:', file.size);
    const allowedTypes = [
      'image/jpeg', 
      'image/png', 
      'image/jpg', 
      'image/webp',
      'image/gif',
      'image/bmp'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.error('❌ Type non autorisé:', file.mimetype);
      cb(new Error(`Type de fichier non autorisé: ${file.mimetype}. Utilisez JPG, PNG, WebP, GIF ou BMP.`), false);
    }
  }
});
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: config.maxFileSize },
//   fileFilter: (req, file, cb) => {
//     if (config.allowedFileTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Type de fichier non autorisé'), false);
//     }
//   }
// });

// Génération de token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiration });
};

// Génération de code de vérification
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Helper pour nettoyer les données utilisateur
const sanitizeUser = (user) => {
  const { password, verification_code, verification_code_expires, reset_token, reset_token_expires, ...cleanUser } = user;
  return cleanUser;
};

// 🟢 REGISTER - VERSION CORRIGÉE
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, role, genre } = req.body;

    if (!email || !password || !username || !role || !genre) {
      return res.status(400).json({ success: false, error: 'Tous les champs sont requis' });
    }

    const existingUser = await usersDB.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();

    const newUser = await usersDB.create({
      email,
      password: hashedPassword,
      username,
      role,
      genre,
      email_verified: true,
      verification_code: verificationCode,
      verification_code_expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      photo_profil: null
    });

    // ✅ Créer le profil précepteur
    if (role === 'precepteur') {
      await precepteursDB.create({
        user_id: newUser.id,
        statut_verification: 'en_attente',
        disponible: false,
        note_moyenne: 0,
        precepteur_matieres: []
      });
    }

    // ✅ AJOUTER CECI : Créer le profil parent
    if (role === 'parent') {
      const parentsDB = new (require('../utils/database').JSONDatabase)('parents.json');
      await parentsDB.init();
      
      await parentsDB.create({
        user_id: newUser.id,
        telephone: null,
        adresse: null,
        commune: null,
        quartier: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      console.log('✅ Profil parent créé pour:', newUser.id);
    }

    console.log(`📧 Code de vérification pour ${email}: ${verificationCode}`);

    res.status(201).json({
      success: true,
      message: 'Inscription réussie. Veuillez vérifier votre email.',
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    console.error('❌ Erreur inscription:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'inscription' });
  }
});
// 🟢 LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Tentative login:', email);

    const user = await usersDB.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Email ou mot de passe incorrect' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Email ou mot de passe incorrect' });
    }

    // ✅ Générer le token
    const token = generateToken(user.id);
    console.log('✅ Token généré:', token.substring(0, 30) + '...');

    // Cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // false en développement
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    // ✅ RETOURNER LE TOKEN
    const response = { 
      success: true, 
      user: sanitizeUser(user), 
      token: token 
    };
    
    console.log('📤 Réponse login:', { success: true, user: user.email, token: '...' });
    res.json(response);
    
  } catch (error) {
    console.error('❌ Erreur connexion:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la connexion' });
  }
});

// 🟢 LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

// 🟢 GET CURRENT USER
router.get('/me', authenticateToken, async (req, res) => {
  try {
    let precepteurInfo = null;
    if (req.user.role === 'precepteur') {
      precepteurInfo = await precepteursDB.findOne({ user_id: req.user.id });
    }

    res.json({
      success: true,
      user: sanitizeUser(req.user),
      precepteurInfo
    });
  } catch (error) {
    console.error('❌ Erreur récupération utilisateur:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des informations' });
  }
});

// 🟢 VERIFY EMAIL
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await usersDB.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    if (user.email_verified) {
      return res.status(400).json({ success: false, error: 'Email déjà vérifié' });
    }

    if (user.verification_code !== code) {
      return res.status(400).json({ success: false, error: 'Code de vérification invalide' });
    }

    if (new Date(user.verification_code_expires) < new Date()) {
      return res.status(400).json({ success: false, error: 'Code de vérification expiré' });
    }

    await usersDB.update(user.id, {
      email_verified: true,
      verification_code: null,
      verification_code_expires: null
    });

    const token = generateToken(user.id);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ success: true, message: 'Email vérifié avec succès' });
  } catch (error) {
    console.error('❌ Erreur vérification:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la vérification' });
  }
});

// 🟢 RESEND VERIFICATION
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await usersDB.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    if (user.email_verified) {
      return res.status(400).json({ success: false, error: 'Email déjà vérifié' });
    }

    const newCode = generateVerificationCode();
    await usersDB.update(user.id, {
      verification_code: newCode,
      verification_code_expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });

    console.log(`📧 Nouveau code pour ${email}: ${newCode}`);

    res.json({ success: true, message: 'Code de vérification renvoyé' });
  } catch (error) {
    console.error('❌ Erreur renvoi code:', error);
    res.status(500).json({ success: false, error: 'Erreur lors du renvoi du code' });
  }
});


// 🟢 UPDATE PROFILE (avec photo) - VERSION CORRIGÉE
router.put('/profile', authenticateToken, upload.single('photo'), async (req, res) => {
  try {
    console.log('📸 UPLOAD PHOTO - Début');
    console.log('  - File reçu:', req.file ? 'OUI' : 'NON');
    
    const updates = {};
    
    // ✅ CAS 1: Fichier uploadé via FormData (multer)
    if (req.file) {
      const photoPath = `/uploads/profils/${req.file.filename}`;
      updates.photo_profil = photoPath;
      console.log('✅ Photo sauvegardée via multer:', photoPath);
    }
    // ✅ CAS 2: Base64 dans le body
    else if (req.body.photo_profil && req.body.photo_profil.startsWith('data:image')) {
      try {
        const matches = req.body.photo_profil.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
        if (matches) {
          const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
          const base64Data = matches[2];
          const filename = `profile-${req.user.id}-${Date.now()}.${extension}`;
          const filepath = path.join(config.uploadPath, 'profils', filename);
          
          // Créer le dossier si nécessaire
          await fs.mkdir(path.join(config.uploadPath, 'profils'), { recursive: true });
          
          // Écrire le fichier
          await fs.writeFile(filepath, base64Data, 'base64');
          
          updates.photo_profil = `/uploads/profils/${filename}`;
          console.log('✅ Photo sauvegardée via base64:', updates.photo_profil);
        }
      } catch (base64Error) {
        console.error('❌ Erreur base64:', base64Error);
        return res.status(400).json({ success: false, error: 'Format d\'image invalide' });
      }
    }
    // ✅ CAS 3: URL directe
    else if (req.body.photo_profil && req.body.photo_profil.startsWith('http')) {
      updates.photo_profil = req.body.photo_profil;
      console.log('✅ Photo URL directe:', updates.photo_profil);
    }
    // ✅ CAS 4: Chemin déjà formaté
    else if (req.body.photo_profil && req.body.photo_profil.startsWith('/uploads')) {
      updates.photo_profil = req.body.photo_profil;
      console.log('✅ Photo chemin existant:', updates.photo_profil);
    }
    
    // Ajouter les autres champs si présents
    if (req.body.username) updates.username = req.body.username;
    if (req.body.genre) updates.genre = req.body.genre;
    if (req.body.telephone) updates.telephone = req.body.telephone;
    
    // Si rien à mettre à jour
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Aucune donnée à mettre à jour' 
      });
    }
    
    console.log('📝 Updates à appliquer:', updates);
    
    // ✅ Mettre à jour dans la base de données
    const updatedUser = await usersDB.update(req.user.id, updates);
    
    // Nettoyer les données sensibles
    const { password, verification_code, verification_code_expires, reset_token, reset_token_expires, ...userWithoutSensitive } = updatedUser;
    
    res.json({
      success: true,
      user: userWithoutSensitive,
      message: 'Profil mis à jour avec succès'
    });
    
  } catch (error) {
    console.error('❌ Erreur mise à jour profil:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de la mise à jour du profil' 
    });
  }
});

// 🟢 FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await usersDB.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'Aucun compte associé à cet email' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    await usersDB.update(user.id, {
      reset_token: resetToken,
      reset_token_expires: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    });

    console.log(`🔑 Token de réinitialisation pour ${email}: ${resetToken}`);

    res.json({ success: true, message: 'Email de réinitialisation envoyé' });
  } catch (error) {
    console.error('❌ Erreur mot de passe oublié:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la demande de réinitialisation' });
  }
});

// ============ ROUTES PRÉCEPTEUR ============

// 🟢 METTRE À JOUR LE PROFIL PRÉCEPTEUR
router.put('/precepteur/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude, commune, quartier, annees_experience, diplome, etablissement_origine, telephone, matieres } = req.body;

    // Vérifier que l'utilisateur est un précepteur
    if (req.user.role !== 'precepteur') {
      return res.status(403).json({ success: false, error: 'Seuls les précepteurs peuvent modifier ce profil' });
    }

    // Chercher ou créer le profil précepteur
    let precepteur = await precepteursDB.findOne({ user_id: userId });

    const precepteurData = {
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      commune: commune || null,
      quartier: quartier || null,
      annees_experience: annees_experience || 0,
      diplome: diplome || null,
      etablissement_origine: etablissement_origine || null,
      telephone: telephone || null,
      updated_at: new Date().toISOString()
    };

    if (precepteur) {
      // Mise à jour
      precepteur = await precepteursDB.update(precepteur.id, precepteurData);
    } else {
      // Création
      precepteur = await precepteursDB.create({
        user_id: userId,
        ...precepteurData,
        statut_verification: 'en_attente',
        disponible: true,
        note_moyenne: 0,
        precepteur_matieres: []
      });
    }

    // Mettre à jour les matières
    if (precepteur && matieres && Array.isArray(matieres)) {
      // Récupérer les matières depuis la base
      const matieresDB = new (require('../utils/database').JSONDatabase)('matieres.json');
      await matieresDB.init();
      
      const allMatieres = await matieresDB.findAll();
      const selectedMatieres = allMatieres.filter(m => matieres.includes(m.id));
      
      precepteur.precepteur_matieres = selectedMatieres.map(m => ({
        matiere_id: m.id,
        matiere: m
      }));
      
      await precepteursDB.update(precepteur.id, {
        precepteur_matieres: precepteur.precepteur_matieres
      });
    }

    res.json({ success: true, precepteur });
  } catch (error) {
    console.error('❌ Erreur mise à jour profil précepteur:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour du profil' });
  }
});

// 🟢 RÉCUPÉRER LES MATIÈRES DISPONIBLES
router.get('/precepteur/matieres', authenticateToken, async (req, res) => {
  try {
    const matieresDB = new (require('../utils/database').JSONDatabase)('matieres.json');
    await matieresDB.init();
    
    const matieres = await matieresDB.findAll();
    res.json({ success: true, matieres });
  } catch (error) {
    console.error('❌ Erreur récupération matières:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des matières' });
  }
});

// 🟢 RÉCUPÉRER LES CONTRATS DU PRÉCEPTEUR
router.get('/precepteur/contrats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Trouver le précepteur
    const precepteur = await precepteursDB.findOne({ user_id: userId });
    if (!precepteur) {
      return res.json({ success: true, contrats: [] });
    }

    // Récupérer les contrats
    const contratsDB = new (require('../utils/database').JSONDatabase)('contracts.json');
    await contratsDB.init();
    
    const contrats = await contratsDB.findAll({ precepteur_id: precepteur.id });

    // Enrichir les contrats avec les données liées
    const enrichedContrats = await Promise.all(contrats.map(async (contrat) => {
      const elevesDB = new (require('../utils/database').JSONDatabase)('eleves.json');
      await elevesDB.init();
      const eleve = await elevesDB.findById(contrat.eleve_id);

      const matieresDB = new (require('../utils/database').JSONDatabase)('matieres.json');
      await matieresDB.init();
      const matiere = await matieresDB.findById(contrat.matiere_id);

      // Récupérer les sessions
      const sessionsDB = new (require('../utils/database').JSONDatabase)('sessions.json');
      await sessionsDB.init();
      const sessions = await sessionsDB.findAll({ contract_id: contrat.id });

      // Récupérer le parent
      const parentsDB = new (require('../utils/database').JSONDatabase)('parents.json');
      await parentsDB.init();
      const parent = await parentsDB.findById(contrat.parent_id);
      
      let parentUser = null;
      if (parent) {
        parentUser = await usersDB.findById(parent.user_id);
        if (parentUser) {
          const { password, ...cleanParentUser } = parentUser;
          parentUser = cleanParentUser;
        }
      }

      return {
        ...contrat,
        eleve,
        matiere,
        sessions: sessions || [],
        parent: parent ? { ...parent, user: parentUser } : null
      };
    }));

    res.json({ success: true, contrats: enrichedContrats });
  } catch (error) {
    console.error('❌ Erreur récupération contrats:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des contrats' });
  }
});

// 🟢 CHANGER LE STATUT D'UN CONTRAT
router.put('/precepteur/contrats/:id/status', authenticateToken, async (req, res) => {
  try {
    const contratId = req.params.id;
    const { status } = req.body;

    const contratsDB = new (require('../utils/database').JSONDatabase)('contracts.json');
    await contratsDB.init();
    
    const contrat = await contratsDB.findById(contratId);
    if (!contrat) {
      return res.status(404).json({ success: false, error: 'Contrat non trouvé' });
    }

    await contratsDB.update(contratId, { 
      statut: status,
      updated_at: new Date().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur mise à jour contrat:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour du contrat' });
  }
});

// 🟢 CRÉER UNE SESSION - VERSION CORRIGÉE
router.post('/precepteur/sessions', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'precepteur') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' });
    }

    const { 
      contract_id,  // ✅ Peut être string ou number
      date_session, 
      heure_debut, 
      heure_fin, 
      lieu, 
      notes_precepteur 
    } = req.body;

    console.log('📝 Création session:', { contract_id, date_session, heure_debut, heure_fin, lieu });

    // ✅ Validation : vérifier que contract_id existe (string ou number)
    if (!contract_id || String(contract_id).trim() === '') {
      return res.status(400).json({ success: false, error: 'contract_id est requis' });
    }
    if (!date_session) {
      return res.status(400).json({ success: false, error: 'date_session est requis' });
    }
    if (!heure_debut) {
      return res.status(400).json({ success: false, error: 'heure_debut est requis' });
    }
    if (!heure_fin) {
      return res.status(400).json({ success: false, error: 'heure_fin est requis' });
    }
    if (!lieu || lieu.trim() === '') {
      return res.status(400).json({ success: false, error: 'lieu est requis' });
    }

    // Vérifier que le contrat appartient au précepteur
    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur) {
      return res.status(404).json({ success: false, error: 'Précepteur non trouvé' });
    }

    const contratsDB = new (require('../utils/database').JSONDatabase)('contracts.json');
    await contratsDB.init();
    
    // ✅ Chercher le contrat par ID string
    const contrat = await contratsDB.findById(String(contract_id));
    
    console.log('🔍 Contrat recherché:', String(contract_id), 'Trouvé:', !!contrat);
    
    if (!contrat) {
      return res.status(404).json({ success: false, error: 'Contrat non trouvé' });
    }

    // ✅ Vérifier que le contrat appartient bien au précepteur (comparaison string)
    if (String(contrat.precepteur_id) !== String(precepteur.id)) {
      return res.status(403).json({ success: false, error: 'Ce contrat ne vous appartient pas' });
    }

    // Calculer la durée
    const [hDeb, mDeb] = heure_debut.split(':').map(Number);
    const [hFin, mFin] = heure_fin.split(':').map(Number);
    const dureeMinutes = (hFin * 60 + mFin) - (hDeb * 60 + mDeb);

    if (dureeMinutes < 30) {
      return res.status(400).json({ success: false, error: 'La durée minimale est de 30 minutes' });
    }

    const sessionsDB = await getSessionsDB();
    
    // ✅ Stocker le contract_id en string
    const session = await sessionsDB.create({
      contract_id: String(contract_id),
      date_session,
      heure_debut,
      heure_fin,
      duree_minutes: dureeMinutes,
      statut: 'planifie',
      type_session: 'presentiel',
      lieu: lieu.trim(),
      lien_visio: null,
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
    
    res.status(201).json({ success: true, session });
  } catch (error) {
    console.error('❌ Erreur création session:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 CHANGER LE STATUT D'UNE SESSION
router.put('/precepteur/sessions/:id/status', authenticateToken, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { status } = req.body;

    const sessionsDB = new (require('../utils/database').JSONDatabase)('sessions.json');
    await sessionsDB.init();

    const session = await sessionsDB.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session non trouvée' });
    }

    await sessionsDB.update(sessionId, {
      statut: status,
      updated_at: new Date().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur mise à jour session:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour de la session' });
  }
});

// 🟢 METTRE À JOUR LES NOTES D'UNE SESSION
router.put('/precepteur/sessions/:id/notes', authenticateToken, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { notes } = req.body;

    const sessionsDB = new (require('../utils/database').JSONDatabase)('sessions.json');
    await sessionsDB.init();

    await sessionsDB.update(sessionId, {
      notes_precepteur: notes,
      updated_at: new Date().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur mise à jour notes:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour des notes' });
  }
});

// 🟢 METTRE À JOUR LA DISPONIBILITÉ
router.put('/precepteur/disponibility', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { disponible } = req.body;

    const precepteur = await precepteursDB.findOne({ user_id: userId });
    if (!precepteur) {
      return res.status(404).json({ success: false, error: 'Précepteur non trouvé' });
    }

    await precepteursDB.update(precepteur.id, {
      disponible,
      updated_at: new Date().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur mise à jour disponibilité:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour' });
  }
});

// Dans routes/auth.js, ajouter ces routes ADMIN

// 🟢 ADMIN - Récupérer tous les utilisateurs
router.get('/admin/users', authenticateToken, async (req, res) => {
  try {
    // Vérifier que c'est un admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' })
    }

    const users = await usersDB.findAll()
    
    // Enrichir avec les détails précepteur
    const enrichedUsers = await Promise.all(users.map(async (user) => {
      const { password, verification_code, verification_code_expires, reset_token, reset_token_expires, ...cleanUser } = user
      
      let precepteurDetails = null
      if (user.role === 'precepteur') {
        precepteurDetails = await precepteursDB.findOne({ user_id: user.id })
      }
      
      return {
        ...cleanUser,
        precepteurDetails
      }
    }))

    res.json({ success: true, users: enrichedUsers })
  } catch (error) {
    console.error('❌ Erreur admin/users:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// 🟢 ADMIN - Changer le rôle d'un utilisateur
router.put('/admin/users/:id/role', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' })
    }

    const { role } = req.body
    const validRoles = ['admin', 'parent', 'precepteur', 'responsable_pedagogique']
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, error: 'Rôle invalide' })
    }

    await usersDB.update(req.params.id, { role })
    res.json({ success: true })
  } catch (error) {
    console.error('❌ Erreur admin/role:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// 🟢 ADMIN - Supprimer un utilisateur
router.delete('/admin/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' })
    }

    // Ne pas permettre de se supprimer soi-même
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, error: 'Vous ne pouvez pas vous supprimer vous-même' })
    }

    await usersDB.delete(req.params.id)
    res.json({ success: true })
  } catch (error) {
    console.error('❌ Erreur admin/delete:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// 🟢 ADMIN - Vérifier l'email d'un utilisateur
router.post('/admin/users/:id/verify-email', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' })
    }

    await usersDB.update(req.params.id, {
      email_verified: true,
      verification_code: null,
      verification_code_expires: null
    })
    
    res.json({ success: true })
  } catch (error) {
    console.error('❌ Erreur admin/verify:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})
// 🟢 RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await usersDB.findOne({ reset_token: token });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Token invalide' });
    }

    if (new Date(user.reset_token_expires) < new Date()) {
      return res.status(400).json({ success: false, error: 'Token expiré' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await usersDB.update(user.id, {
      password: hashedPassword,
      reset_token: null,
      reset_token_expires: null
    });

    res.json({ success: true, message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    console.error('❌ Erreur réinitialisation:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la réinitialisation' });
  }
});


// Configuration multer pour les documents - VERSION CORRIGÉE
const documentStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      // ✅ Utilisez un dossier par défaut si req.user n'existe pas
      const userId = req.user?.id || 'temp';
      const uploadDir = path.join(config.uploadPath, 'documents', String(userId));
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, '');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  }
});

const documentUpload = multer({
  storage: documentStorage,
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Acceptés: PDF, JPG, PNG, DOC, DOCX'), false);
    }
  }
});

// Helper pour initialiser la DB documents
async function getDocumentsDB() {
  const { JSONDatabase } = require('../utils/database');
  const db = new JSONDatabase('documents.json');
  await db.init();
  return db;
}

// 🟢 UPLOAD DOCUMENT
router.post('/precepteur/documents', authenticateToken, documentUpload.single('fichier'), async (req, res) => {
  try {
    console.log('📄 Upload document reçu');
    console.log('  - File:', req.file ? req.file.filename : 'AUCUN');
    console.log('  - Body:', req.body);
    
    const { titre, type_document } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'Aucun fichier fourni' 
      });
    }
    
    if (!titre || !type_document) {
      // Supprimer le fichier uploadé si données incomplètes
      await fs.promises.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ 
        success: false, 
        error: 'Titre et type de document requis' 
      });
    }
    
    // Vérifier que l'utilisateur est un précepteur
    if (req.user.role !== 'precepteur') {
      await fs.promises.unlink(req.file.path).catch(() => {});
      return res.status(403).json({ 
        success: false, 
        error: 'Seuls les précepteurs peuvent uploader des documents' 
      });
    }
    
    // Trouver le précepteur
    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur) {
      await fs.promises.unlink(req.file.path).catch(() => {});
      return res.status(404).json({ 
        success: false, 
        error: 'Profil précepteur non trouvé' 
      });
    }
    
    // Vérifier les doublons (même titre + même type)
    const documentsDB = await getDocumentsDB();
    const existingDocs = await documentsDB.findAll({ 
      precepteur_id: precepteur.id,
      titre: titre,
      type_document: type_document
    });
    
    if (existingDocs.length > 0) {
      await fs.promises.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ 
        success: false, 
        error: 'Un document avec ce titre et ce type existe déjà' 
      });
    }
    
    // Construire le chemin relatif pour l'accès HTTP
    const relativePath = `/uploads/documents/${req.user.id}/${req.file.filename}`;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fullUrl = `${baseUrl}${relativePath}`;
    
    // Créer le document dans la base
    const document = await documentsDB.create({
      precepteur_id: precepteur.id,
      user_id: req.user.id,
      titre,
      type_document,
      fichier_url: fullUrl,
      fichier_path: relativePath,
      format_fichier: req.file.mimetype,
      taille_fichier: req.file.size,
      statut_verification: 'en_attente',
      commentaire_verification: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    console.log('✅ Document créé:', document.id, '-', titre);
    
    res.status(201).json({
      success: true,
      document,
      url: fullUrl,
      message: 'Document uploadé avec succès'
    });
    
  } catch (error) {
    console.error('❌ Erreur upload document:', error);
    
    // Nettoyer le fichier en cas d'erreur
    if (req.file) {
      await fs.promises.unlink(req.file.path).catch(() => {});
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de l\'upload du document' 
    });
  }
});

// 🟢 RÉCUPÉRER LES DOCUMENTS DU PRÉCEPTEUR CONNECTÉ
router.get('/precepteur/documents', authenticateToken, async (req, res) => {
  try {
    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur) {
      return res.json({ success: true, documents: [] });
    }
    
    const documentsDB = await getDocumentsDB();
    const documents = await documentsDB.findAll({ 
      precepteur_id: precepteur.id 
    });
    
    // Trier par date de création (plus récent d'abord)
    documents.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    res.json({ 
      success: true, 
      documents 
    });
    
  } catch (error) {
    console.error('❌ Erreur récupération documents:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la récupération des documents' 
    });
  }
});

// 🟢 SUPPRIMER UN DOCUMENT
router.delete('/precepteur/documents/:id', authenticateToken, async (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    
    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur) {
      return res.status(404).json({ success: false, error: 'Précepteur non trouvé' });
    }
    
    const documentsDB = await getDocumentsDB();
    const document = await documentsDB.findById(documentId);
    
    if (!document) {
      return res.status(404).json({ success: false, error: 'Document non trouvé' });
    }
    
    // Vérifier que le document appartient au précepteur
    if (document.precepteur_id !== precepteur.id) {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }
    
    // Supprimer le fichier physique
    if (document.fichier_path) {
      const filePath = path.join(config.uploadPath, '..', document.fichier_path);
      await fs.promises.unlink(filePath).catch(err => {
        console.warn('⚠️ Impossible de supprimer le fichier:', err.message);
      });
    }
    
    // Supprimer de la base
    await documentsDB.delete(documentId);
    
    console.log('✅ Document supprimé:', documentId);
    
    res.json({ success: true, message: 'Document supprimé' });
    
  } catch (error) {
    console.error('❌ Erreur suppression document:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la suppression' 
    });
  }
});

// 🟢 ADMIN - Récupérer les documents d'un utilisateur
router.get('/admin/documents/:userId', authenticateToken, async (req, res) => {
  try {
    // Vérifier que c'est un admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' });
    }
    
    const userId = req.params.userId;
    
    // Trouver le précepteur
    const precepteur = await precepteursDB.findOne({ user_id: userId });
    if (!precepteur) {
      return res.json({ success: true, documents: [] });
    }
    
    const documentsDB = await getDocumentsDB();
    const documents = await documentsDB.findAll({ 
      precepteur_id: precepteur.id 
    });
    
    documents.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    res.json({ 
      success: true, 
      documents 
    });
    
  } catch (error) {
    console.error('❌ Erreur admin documents:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur' 
    });
  }
});

// 🟢 ADMIN - Mettre à jour le statut d'un document
router.put('/admin/documents/:id/status', authenticateToken, async (req, res) => {
  try {
    // Vérifier que c'est un admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' });
    }
    
    const documentId = parseInt(req.params.id);
    const { statut, commentaire } = req.body;
    
    if (!['verifie', 'rejete'].includes(statut)) {
      return res.status(400).json({ success: false, error: 'Statut invalide' });
    }
    
    const documentsDB = await getDocumentsDB();
    const document = await documentsDB.findById(documentId);
    
    if (!document) {
      return res.status(404).json({ success: false, error: 'Document non trouvé' });
    }
    
    await documentsDB.update(documentId, {
      statut_verification: statut,
      commentaire_verification: commentaire || null,
      updated_at: new Date().toISOString()
    });
    
    console.log(`✅ Document ${documentId} -> ${statut}`);
    
    res.json({ success: true, message: `Document ${statut}` });
    
  } catch (error) {
    console.error('❌ Erreur mise à jour statut document:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur' 
    });
  }
});
// routes/auth.js - Ajouter ces routes

// 🟢 ADMIN - Récupérer les précepteurs pour vérification
router.get('/admin/precepteurs/verification', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' })
    }

    const users = await usersDB.findAll()
    const precepteurs = await precepteursDB.findAll()
    
    // Enrichir les données
    const enriched = await Promise.all(precepteurs.map(async (p) => {
      const user = users.find(u => u.id === p.user_id)
      if (!user) return null
      
      const { password, verification_code, verification_code_expires, reset_token, reset_token_expires, ...cleanUser } = user
      
      return {
        ...p,
        user: cleanUser,
        matieres: p.precepteur_matieres || []
      }
    }))

    const validPrecepteurs = enriched.filter(Boolean)
    
    // Calculer les stats
    const stats = {
      en_attente: validPrecepteurs.filter(p => p.statut_verification === 'en_attente').length,
      verifie: validPrecepteurs.filter(p => p.statut_verification === 'verifie').length,
      rejete: validPrecepteurs.filter(p => p.statut_verification === 'rejete').length,
      total: validPrecepteurs.length
    }

    res.json({ success: true, precepteurs: validPrecepteurs, stats })
  } catch (error) {
    console.error('❌ Erreur:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

// 🟢 ADMIN - Mettre à jour le statut de vérification
// 🟢 ADMIN - Mettre à jour le statut de vérification
router.put('/admin/precepteurs/:id/verification', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' })
    }

    const { statut, commentaire } = req.body
    
    if (!['verifie', 'rejete'].includes(statut)) {
      return res.status(400).json({ success: false, error: 'Statut invalide' })
    }

    // ✅ CORRECTION : Ne pas utiliser parseInt, garder l'ID en string
    const precepteurId = req.params.id;
    
    console.log(`🔍 Mise à jour précepteur ${precepteurId} -> ${statut}`);
    
    // Vérifier que le précepteur existe
    const allPrecepteurs = await precepteursDB.findAll();
    const precepteur = allPrecepteurs.find(p => String(p.id) === String(precepteurId));
    
    if (!precepteur) {
      console.log(`❌ Précepteur ${precepteurId} non trouvé`);
      return res.status(404).json({ success: false, error: 'Précepteur non trouvé' });
    }
    
    console.log(`  - Avant: ${precepteur.statut_verification}`);
    
    // Mettre à jour
    const updatedPrecepteur = await precepteursDB.update(precepteurId, {
      statut_verification: statut,
      commentaire_verification: commentaire || null,
      updated_at: new Date().toISOString()
    });
    
    console.log(`  - Après: ${updatedPrecepteur.statut_verification}`);
    console.log(`✅ Mise à jour réussie`);

    res.json({ 
      success: true, 
      message: `Statut mis à jour : ${statut}`,
      precepteur: updatedPrecepteur
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// routes/auth.js - Ajouter ces routes MATIÈRES

// Helper pour la DB matières
async function getMatieresDB() {
  const { JSONDatabase } = require('../utils/database');
  const db = new JSONDatabase('matieres.json');
  await db.init();
  return db;
}

// 🟢 RÉCUPÉRER TOUTES LES MATIÈRES (accessible à tous les utilisateurs authentifiés)
router.get('/matieres', authenticateToken, async (req, res) => {
  try {
    const matieresDB = await getMatieresDB();
    let matieres = await matieresDB.findAll();
    
    // Filtre de recherche
    const { search } = req.query;
    if (search) {
      const term = search.toLowerCase();
      matieres = matieres.filter(m => 
        m.nom.toLowerCase().includes(term) ||
        (m.description && m.description.toLowerCase().includes(term))
      );
    }
    
    // Trier par niveau puis par nom
    matieres.sort((a, b) => {
      if (a.niveau !== b.niveau) return a.niveau.localeCompare(b.niveau);
      return a.nom.localeCompare(b.nom);
    });
    
    res.json({ success: true, matieres });
  } catch (error) {
    console.error('❌ Erreur récupération matières:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 ADMIN - AJOUTER UNE MATIÈRE
router.post('/matieres', authenticateToken, async (req, res) => {
  try {
    // Vérifier que c'est un admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' });
    }
    
    const { nom, niveau, description } = req.body;
    
    if (!nom || !niveau) {
      return res.status(400).json({ success: false, error: 'Nom et niveau requis' });
    }
    
    const matieresDB = await getMatieresDB();
    
    // Vérifier les doublons
    const existing = await matieresDB.findOne({ nom, niveau });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        error: `La matière "${nom}" existe déjà pour le niveau ${niveau}` 
      });
    }
    
    const matiere = await matieresDB.create({
      nom: nom.trim(),
      niveau,
      description: description?.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    console.log('✅ Matière créée:', matiere.id, '-', nom);
    
    res.status(201).json({ success: true, matiere });
  } catch (error) {
    console.error('❌ Erreur création matière:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});


// 🟢 ADMIN - MODIFIER UNE MATIÈRE (CORRIGÉ)
router.put('/matieres/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' });
    }
    
    // ✅ Garder l'ID comme string (ne pas utiliser parseInt)
    const matiereId = req.params.id;
    const { nom, niveau, description } = req.body;
    
    console.log('🔍 Modification matière ID:', matiereId, 'Type:', typeof matiereId);
    
    if (!nom || !niveau) {
      return res.status(400).json({ success: false, error: 'Nom et niveau requis' });
    }
    
    const matieresDB = await getMatieresDB();
    const matiere = await matieresDB.findById(matiereId);
    
    if (!matiere) {
      console.log('❌ Matière non trouvée:', matiereId);
      return res.status(404).json({ success: false, error: 'Matière non trouvée' });
    }
    
    // Vérifier les doublons (autre que celle qu'on modifie)
    const allMatieres = await matieresDB.findAll();
    const existing = allMatieres.find(m => 
      m.nom === nom.trim() && 
      m.niveau === niveau && 
      m.id !== matiereId
    );
    
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        error: `Une matière nommée "${nom}" existe déjà pour le niveau ${niveau}` 
      });
    }
    
    await matieresDB.update(matiereId, {
      nom: nom.trim(),
      niveau,
      description: description?.trim() || null,
      updated_at: new Date().toISOString()
    });
    
    console.log('✅ Matière modifiée:', matiereId);
    
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur modification matière:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 ADMIN - SUPPRIMER UNE MATIÈRE (CORRIGÉ)
router.delete('/matieres/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' });
    }
    
    // ✅ Garder l'ID comme string
    const matiereId = req.params.id;
    
    console.log('🗑️ Suppression matière ID:', matiereId, 'Type:', typeof matiereId);
    
    const matieresDB = await getMatieresDB();
    
    const matiere = await matieresDB.findById(matiereId);
    if (!matiere) {
      console.log('❌ Matière non trouvée pour suppression:', matiereId);
      return res.status(404).json({ success: false, error: 'Matière non trouvée' });
    }
    
    // Supprimer les associations précepteur-matières
    const allPrecepteurs = await precepteursDB.findAll();
    for (const precepteur of allPrecepteurs) {
      if (precepteur.precepteur_matieres && precepteur.precepteur_matieres.length > 0) {
        const filtered = precepteur.precepteur_matieres.filter(
          pm => String(pm.matiere_id) !== String(matiereId)  // ✅ Comparaison en string
        );
        if (filtered.length !== precepteur.precepteur_matieres.length) {
          await precepteursDB.update(precepteur.id, {
            precepteur_matieres: filtered
          });
        }
      }
    }
    
    // Supprimer la matière
    await matieresDB.delete(matiereId);
    
    console.log('✅ Matière supprimée:', matiereId, '-', matiere.nom);
    
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur suppression matière:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});
module.exports = router;



// ============ ROUTES SERVICES PRÉCEPTEUR ============

// Helper pour la DB services
async function getServicesDB() {
  const { JSONDatabase } = require('../utils/database');
  const db = new JSONDatabase('services_precepteur.json');
  await db.init();
  return db;
}

// 🟢 RÉCUPÉRER LES SERVICES D'UN PRÉCEPTEUR
router.get('/precepteur/services', authenticateToken, async (req, res) => {
  try {
    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur) {
      return res.json({ success: true, services: [] });
    }

    const servicesDB = await getServicesDB();
    const services = await servicesDB.findAll({ 
      precepteur_id: precepteur.id 
    });

    // Trier par date de création (plus récent d'abord)
    services.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({ success: true, services });
  } catch (error) {
    console.error('❌ Erreur récupération services:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 RÉCUPÉRER LES SERVICES D'UN PRÉCEPTEUR PAR ID (pour consultation publique)
router.get('/precepteur/services/:precepteurId', async (req, res) => {
  try {
    const servicesDB = await getServicesDB();
    const services = await servicesDB.findAll({ 
      precepteur_id: parseInt(req.params.precepteurId),
      est_actif: true
    });

    services.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({ success: true, services });
  } catch (error) {
    console.error('❌ Erreur récupération services:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 CRÉER UN SERVICE
router.post('/precepteur/services', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'precepteur') {
      return res.status(403).json({ success: false, error: 'Réservé aux précepteurs' });
    }

    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur) {
      return res.status(404).json({ success: false, error: 'Précepteur non trouvé' });
    }

    const { titre, description, type_service, modalite, tarif_horaire, tarif_forfaitaire, duree_minutes, nombre_eleves_max } = req.body;

    if (!titre) {
      return res.status(400).json({ success: false, error: 'Le titre est requis' });
    }

    const servicesDB = await getServicesDB();
    const service = await servicesDB.create({
      precepteur_id: precepteur.id,
      titre,
      description: description || null,
      type_service: type_service || 'cours_particulier',
      modalite: modalite || 'presentiel',
      tarif_horaire: tarif_horaire || null,
      tarif_forfaitaire: tarif_forfaitaire || null,
      duree_minutes: duree_minutes || 60,
      nombre_eleves_max: nombre_eleves_max || 1,
      est_actif: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    res.status(201).json({ success: true, service });
  } catch (error) {
    console.error('❌ Erreur création service:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 MODIFIER UN SERVICE
router.put('/precepteur/services/:id', authenticateToken, async (req, res) => {
  try {
    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur) {
      return res.status(404).json({ success: false, error: 'Précepteur non trouvé' });
    }

    const servicesDB = await getServicesDB();
    const service = await servicesDB.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, error: 'Service non trouvé' });
    }

    if (service.precepteur_id !== precepteur.id) {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    const { titre, description, type_service, modalite, tarif_horaire, tarif_forfaitaire, duree_minutes, nombre_eleves_max } = req.body;

    await servicesDB.update(req.params.id, {
      titre: titre || service.titre,
      description: description !== undefined ? description : service.description,
      type_service: type_service || service.type_service,
      modalite: modalite || service.modalite,
      tarif_horaire: tarif_horaire !== undefined ? tarif_horaire : service.tarif_horaire,
      tarif_forfaitaire: tarif_forfaitaire !== undefined ? tarif_forfaitaire : service.tarif_forfaitaire,
      duree_minutes: duree_minutes || service.duree_minutes,
      nombre_eleves_max: nombre_eleves_max || service.nombre_eleves_max,
      updated_at: new Date().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur modification service:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 SUPPRIMER UN SERVICE
router.delete('/precepteur/services/:id', authenticateToken, async (req, res) => {
  try {
    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur) {
      return res.status(404).json({ success: false, error: 'Précepteur non trouvé' });
    }

    const servicesDB = await getServicesDB();
    const service = await servicesDB.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, error: 'Service non trouvé' });
    }

    if (service.precepteur_id !== precepteur.id) {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    await servicesDB.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur suppression service:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 ACTIVER/DÉSACTIVER UN SERVICE
router.patch('/precepteur/services/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur) {
      return res.status(404).json({ success: false, error: 'Précepteur non trouvé' });
    }

    const servicesDB = await getServicesDB();
    const service = await servicesDB.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, error: 'Service non trouvé' });
    }

    if (service.precepteur_id !== precepteur.id) {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    await servicesDB.update(req.params.id, {
      est_actif: !service.est_actif,
      updated_at: new Date().toISOString()
    });

    res.json({ success: true, est_actif: !service.est_actif });
  } catch (error) {
    console.error('❌ Erreur toggle service:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});


router.get('/services', async (req, res) => {
  try {
    console.log('📡 GET /services - Récupération de tous les services');
    
    const servicesDB = await getServicesDB();
    const services = await servicesDB.findAll({ est_actif: true });
    
    console.log(`✅ ${services.length} services trouvés`);
    
    // ✅ Enrichir avec les infos des précepteurs
    const enrichedServices = [];
    
    for (const service of services) {
      try {
        // ✅ Récupérer le précepteur
        const precepteur = await precepteursDB.findById(service.precepteur_id);
        
        if (!precepteur) {
          console.log(`⚠️ Précepteur non trouvé pour le service ${service.id}`);
          continue;
        }
        
        // ✅ Récupérer l'utilisateur lié au précepteur
        const user = await usersDB.findById(precepteur.user_id);
        
        if (!user) {
          console.log(`⚠️ Utilisateur non trouvé pour le précepteur ${precepteur.id}`);
          continue;
        }
        
        // ✅ Nettoyer les données sensibles de l'utilisateur
        const { 
          password, 
          verification_code, 
          verification_code_expires, 
          reset_token, 
          reset_token_expires, 
          ...cleanUser 
        } = user;
        
        // ✅ Récupérer les matières du précepteur
        let matieres = [];
        if (precepteur.precepteur_matieres && precepteur.precepteur_matieres.length > 0) {
          const matieresDB = new (require('../utils/database').JSONDatabase)('matieres.json');
          await matieresDB.init();
          
          for (const pm of precepteur.precepteur_matieres) {
            const matiere = await matieresDB.findById(pm.matiere_id);
            if (matiere) {
              matieres.push({
                matiere_id: pm.matiere_id,
                matiere: {
                  id: matiere.id,
                  nom: matiere.nom,
                  niveau: matiere.niveau
                }
              });
            }
          }
        }
        
        // ✅ Construire l'objet enrichi
        enrichedServices.push({
          id: service.id,
          precepteur_id: service.precepteur_id,
          titre: service.titre,
          description: service.description,
          type_service: service.type_service,
          modalite: service.modalite,
          tarif_horaire: service.tarif_horaire,
          tarif_forfaitaire: service.tarif_forfaitaire,
          duree_minutes: service.duree_minutes,
          nombre_eleves_max: service.nombre_eleves_max,
          est_actif: service.est_actif,
          created_at: service.created_at,
          updated_at: service.updated_at,
          // ✅ Inclure TOUTES les infos du précepteur
          precepteur: {
            id: precepteur.id,
            user_id: precepteur.user_id,
            commune: precepteur.commune || null,
            quartier: precepteur.quartier || null,
            annees_experience: precepteur.annees_experience || 0,
            diplome: precepteur.diplome || null,
            etablissement_origine: precepteur.etablissement_origine || null,
            note_moyenne: precepteur.note_moyenne || 0,
            disponible: precepteur.disponible !== false, // true par défaut
            telephone: precepteur.telephone || null,
            statut_verification: precepteur.statut_verification || 'en_attente',
            // ✅ Inclure l'utilisateur avec sa photo
            user: {
              id: cleanUser.id,
              username: cleanUser.username,
              email: cleanUser.email,
              photo_profil: cleanUser.photo_profil || null, // ✅ PHOTO DE PROFIL
              genre: cleanUser.genre || null,
              email_verified: cleanUser.email_verified
            },
            // ✅ Inclure les matières
            precepteur_matieres: matieres
          }
        });
        
      } catch (err) {
        console.error(`❌ Erreur enrichissement service ${service.id}:`, err);
      }
    }
    
    console.log(`📤 Retourne ${enrichedServices.length} services enrichis`);
    
    // ✅ Vérifier que les photos sont bien incluses
    enrichedServices.forEach(s => {
      if (s.precepteur?.user?.photo_profil) {
        console.log(`  - Photo pour ${s.precepteur.user.username}: ${s.precepteur.user.photo_profil}`);
      }
    });
    
    res.json({ 
      success: true, 
      services: enrichedServices,
      total: enrichedServices.length
    });
    
  } catch (error) {
    console.error('❌ Erreur récupération services:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur serveur' 
    });
  }
});

router.get('/parent-services/all', async (req, res) => {
  try {
    console.log('📡 GET /parent-services/all');
    
    const { JSONDatabase } = require('../utils/database');
    
    // 1. Lire les services
    const parentServicesDB = new JSONDatabase('parent_services.json');
    await parentServicesDB.init();
    
    const allServices = await parentServicesDB.findAll();
    console.log(`📊 ${allServices.length} services trouvés`);
    
    // 2. Lire TOUS les élèves
    const elevesDB = new JSONDatabase('eleves.json');
    await elevesDB.init();
    
    const allEleves = await elevesDB.findAll();
    console.log(`📊 ${allEleves.length} élèves trouvés`);
    
    // 3. Créer un map des élèves par ID (en string)
    const elevesMap = {};
    allEleves.forEach(eleve => {
      elevesMap[String(eleve.id)] = eleve;
    });
    console.log('🗺️ Map des élèves créée avec', Object.keys(elevesMap).length, 'entrées');
    
    // 4. Enrichir les services
    const result = allServices.map(service => {
      const eleveId = String(service.eleve_id);
      const eleve = elevesMap[eleveId] || null;
      
      if (eleve) {
        console.log(`  ✅ Élève trouvé pour service ${service.id}: ${eleve.prenom} ${eleve.nom}`);
      } else {
        console.log(`  ❌ Élève NON trouvé pour ID: ${eleveId}`);
      }
      
      return {
        id: service.id,
        parent_id: service.parent_id,
        eleve_id: service.eleve_id,
        titre: service.titre || '',
        description: service.description || '',
        matiere_preferee: service.matiere_preferee || null,
        niveau_eleve: service.niveau_eleve || '',
        frequence_souhaitee: service.frequence_souhaitee || '',
        jours_preferences: service.jours_preferences || null,
        heures_preferences: service.heures_preferences || null,
        budget_horaire: service.budget_horaire || null,
        lieu_preference: service.lieu_preference || '',
        statut: service.statut || 'en_attente',
        nombre_vues: service.nombre_vues || 0,
        nombre_candidatures: service.nombre_candidatures || 0,
        date_creation: service.date_creation || service.created_at,
        date_expiration: service.date_expiration || null,
        eleve: eleve ? {
          id: eleve.id,
          nom: eleve.nom,
          prenom: eleve.prenom,
          postnom: eleve.postnom || null,
          niveau: eleve.niveau,
          ecole: eleve.ecole || null,
          genre: eleve.genre
        } : null
      };
    });
    
    console.log(`✅ ${result.length} services enrichis`);
    console.log(`📤 Services avec élève: ${result.filter(s => s.eleve).length}`);
    
    res.json({ success: true, services: result });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🟢 FILTRER LES SERVICES PARENTS
router.get('/parent-services/search', async (req, res) => {
  try {
    const { matiere, niveau, lieu, budget_min, budget_max, search } = req.query;
    
    const parentServicesDB = new (require('../utils/database').JSONDatabase)('parent_services.json');
    await parentServicesDB.init();
    
    let services = await parentServicesDB.findAll();
    
    // Filtrer par statut
    services = services.filter(s => 
      s.statut === 'actif' || s.statut === 'en_attente' || s.statut === 'pourvu'
    );
    
    // Appliquer les filtres
    if (matiere) {
      const matiereLower = matiere.toLowerCase();
      services = services.filter(s => 
        s.matiere_preferee && s.matiere_preferee.toLowerCase().includes(matiereLower)
      );
    }
    
    if (niveau) {
      services = services.filter(s => s.niveau_eleve === niveau);
    }
    
    if (lieu) {
      services = services.filter(s => s.lieu_preference === lieu);
    }
    
    if (budget_min) {
      const min = parseFloat(budget_min);
      services = services.filter(s => s.budget_horaire && s.budget_horaire >= min);
    }
    
    if (budget_max) {
      const max = parseFloat(budget_max);
      services = services.filter(s => s.budget_horaire && s.budget_horaire <= max);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      services = services.filter(s => 
        s.titre.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower) ||
        s.matiere_preferee?.toLowerCase().includes(searchLower)
      );
    }
    
    // Enrichir (version simplifiée)
    const elevesDB = new (require('../utils/database').JSONDatabase)('eleves.json');
    await elevesDB.init();
    
    const enriched = await Promise.all(services.map(async (service) => {
      const eleve = await elevesDB.findById(service.eleve_id);
      return {
        ...service,
        eleve: eleve ? {
          id: eleve.id,
          nom: eleve.nom,
          prenom: eleve.prenom,
          niveau: eleve.niveau
        } : null
      };
    }));
    
    res.json({ 
      success: true, 
      services: enriched,
      total: enriched.length,
      filters: { matiere, niveau, lieu, budget_min, budget_max, search }
    });
    
  } catch (error) {
    console.error('❌ Erreur recherche services parents:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});



// ============ ROUTES CANDIDATURES ============

// Helper pour la DB candidatures
async function getCandidaturesDB() {
  const { JSONDatabase } = require('../utils/database');
  const db = new JSONDatabase('candidatures.json');
  await db.init();
  return db;
}

// 🟢 POSTULER À UN SERVICE PARENT
router.post('/candidatures', authenticateToken, async (req, res) => {
  try {
    const { service_parent_id, message, tarif_propose, disponibilites } = req.body;
    
    // Récupérer le précepteur connecté
    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur) {
      return res.status(404).json({ success: false, error: 'Précepteur non trouvé' });
    }
    
    const candidaturesDB = await getCandidaturesDB();
    
    const candidature = await candidaturesDB.create({
      service_parent_id,
      precepteur_id: precepteur.id,
      message,
      tarif_propose: tarif_propose || null,
      disponibilites: disponibilites || null,
      statut: 'en_attente',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    // Mettre à jour le compteur de candidatures du service parent
    const parentServicesDB = new (require('../utils/database').JSONDatabase)('parent_services.json');
    await parentServicesDB.init();
    const service = await parentServicesDB.findById(service_parent_id);
    if (service) {
      await parentServicesDB.update(service_parent_id, {
        nombre_candidatures: (service.nombre_candidatures || 0) + 1
      });
    }
    
    res.status(201).json({ success: true, candidature });
  } catch (error) {
    console.error('❌ Erreur candidature:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 VOIR LES CANDIDATURES D'UN SERVICE (pour le parent)
router.get('/candidatures/service/:serviceId', authenticateToken, async (req, res) => {
  try {
    const candidaturesDB = await getCandidaturesDB();
    const allCandidatures = await candidaturesDB.findAll();
    
    const serviceId = req.params.serviceId;
    
    // 🔍 DEBUG
    console.log('📋 Total candidatures:', allCandidatures.length);
    console.log('🔍 Recherche service:', serviceId);
    
    // Afficher toutes les candidatures avec leur service_parent_id
    allCandidatures.forEach(c => {
      console.log(`  - Candidature ${c.id}: service_parent_id=${c.service_parent_id} (type: ${typeof c.service_parent_id})`);
      console.log(`    Match ? ${String(c.service_parent_id) === String(serviceId)}`);
    });
    
    // Filtrer manuellement (comparaison string)
    const candidatures = allCandidatures.filter(c => 
      String(c.service_parent_id) === String(serviceId)
    );
    
    console.log(`✅ ${candidatures.length} candidatures trouvées pour le service ${serviceId}`);
    
    if (candidatures.length === 0) {
      return res.json({ success: true, candidatures: [], message: 'Aucune candidature trouvée' });
    }
    
    // Enrichir avec les infos des précepteurs
    const enriched = await Promise.all(candidatures.map(async (c) => {
      try {
        // Chercher le précepteur par son ID
        const allPrecepteurs = await precepteursDB.findAll();
        const precepteur = allPrecepteurs.find(p => String(p.id) === String(c.precepteur_id));
        
        if (!precepteur) {
          console.log(`⚠️ Précepteur non trouvé pour ID: ${c.precepteur_id}`);
          return { ...c, precepteur: null };
        }
        
        // Chercher l'utilisateur
        const allUsers = await usersDB.findAll();
        const user = allUsers.find(u => String(u.id) === String(precepteur.user_id));
        
        let cleanUser = null;
        if (user) {
          const { password, verification_code, verification_code_expires, reset_token, reset_token_expires, ...rest } = user;
          cleanUser = rest;
        }
        
        return {
          ...c,
          precepteur: {
            id: precepteur.id,
            user_id: precepteur.user_id,
            commune: precepteur.commune || null,
            quartier: precepteur.quartier || null,
            annees_experience: precepteur.annees_experience || 0,
            diplome: precepteur.diplome || null,
            note_moyenne: precepteur.note_moyenne || 0,
            disponible: precepteur.disponible,
            telephone: precepteur.telephone || null,
            statut_verification: precepteur.statut_verification || 'en_attente',
            user: cleanUser
          }
        };
      } catch (err) {
        console.error(`❌ Erreur enrichissement candidature ${c.id}:`, err);
        return { ...c, precepteur: null };
      }
    }));
    
    console.log(`📤 Retourne ${enriched.length} candidatures enrichies`);
    
    res.json({ success: true, candidatures: enriched });
    
  } catch (error) {
    console.error('❌ Erreur récupération candidatures:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// ============ ROUTES CONTRATS ============

// Helper pour la DB contrats
async function getContractsDB() {
  const { JSONDatabase } = require('../utils/database');
  const db = new JSONDatabase('contracts.json');
  await db.init();
  return db;
}

// 🟢 CRÉER UN CONTRAT (depuis un service parent)
router.post('/contracts', authenticateToken, async (req, res) => {
  try {
    const { 
      service_parent_id, 
      precepteur_id, 
      date_debut, 
      duree, 
      tarif_final, 
      notes 
    } = req.body;
    
    // Récupérer le service parent pour les infos
    const parentServicesDB = new (require('../utils/database').JSONDatabase)('parent_services.json');
    await parentServicesDB.init();
    const service = await parentServicesDB.findById(service_parent_id);
    
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service non trouvé' });
    }
    
    const contractsDB = await getContractsDB();
    
    const contrat = await contractsDB.create({
      service_parent_id,
      parent_id: service.parent_id,
      precepteur_id,
      titre: service.titre,
      matiere: service.matiere_preferee,
      niveau: service.niveau_eleve,
      frequence: service.frequence_souhaitee,
      lieu: service.lieu_preference,
      date_debut,
      duree,
      tarif_final,
      notes: notes || null,
      statut: 'en_attente',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    res.status(201).json({ success: true, contrat });
  } catch (error) {
    console.error('❌ Erreur création contrat:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 RÉCUPÉRER MES CONTRATS (parent ou précepteur) - CORRIGÉ
router.get('/contracts', authenticateToken, async (req, res) => {
  try {
    const contractsDB = await getContractsDB();
    const allContrats = await contractsDB.findAll();
    
    console.log('📊 Total contrats dans la DB:', allContrats.length);
    console.log('👤 User connecté:', req.user.id, 'Role:', req.user.role);
    
    let contrats = [];
    
    if (req.user.role === 'parent') {
      // 🔧 Chercher le profil parent avec user_id
      const parentsDB = new (require('../utils/database').JSONDatabase)('parents.json');
      await parentsDB.init();
      
      const parent = await parentsDB.findOne({ user_id: req.user.id });
      console.log('🔍 Profil parent trouvé:', parent ? parent.id : 'NON');
      
      if (parent) {
        // Filtrer par parent_id (ID du profil parent, pas user_id)
        contrats = allContrats.filter(c => {
          const match = String(c.parent_id) === String(parent.id);
          console.log(`  Contrat ${c.id}: parent_id=${c.parent_id} vs parent.id=${parent.id} => ${match}`);
          return match;
        });
      }
      
    } else if (req.user.role === 'precepteur') {
      const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
      if (precepteur) {
        contrats = allContrats.filter(c => 
          String(c.precepteur_id) === String(precepteur.id)
        );
      }
    }
    
    console.log(`✅ ${contrats.length} contrats trouvés pour ce ${req.user.role}`);
    
    // Enrichir avec les infos précepteur si parent
    const enriched = await Promise.all(contrats.map(async (contrat) => {
      try {
        const allPrecepteurs = await precepteursDB.findAll();
        const precepteur = allPrecepteurs.find(p => 
          String(p.id) === String(contrat.precepteur_id)
        );
        
        let precepteurInfo = null;
        if (precepteur) {
          const allUsers = await usersDB.findAll();
          const user = allUsers.find(u => 
            String(u.id) === String(precepteur.user_id)
          );
          
          if (user) {
            const { password, ...cleanUser } = user;
            precepteurInfo = {
              id: precepteur.id,
              commune: precepteur.commune,
              diplome: precepteur.diplome,
              note_moyenne: precepteur.note_moyenne,
              user: cleanUser
            };
          }
        }
        
        return {
          ...contrat,
          precepteur: precepteurInfo
        };
      } catch (err) {
        return contrat;
      }
    }));
    
    res.json({ success: true, contrats: enriched });
    
  } catch (error) {
    console.error('❌ Erreur récupération contrats:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 CHANGER LE STATUT D'UN CONTRAT
router.patch('/contracts/:id/status', authenticateToken, async (req, res) => {
  try {
    const { statut } = req.body;
    const contractsDB = await getContractsDB();
    
    await contractsDB.update(req.params.id, {
      statut,
      updated_at: new Date().toISOString()
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur mise à jour contrat:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 RÉCUPÉRER MES CANDIDATURES (précepteur connecté)
router.get('/candidatures/mes-candidatures', authenticateToken, async (req, res) => {
  try {
    // Vérifier que c'est un précepteur
    if (req.user.role !== 'precepteur') {
      return res.status(403).json({ 
        success: false, 
        error: 'Réservé aux précepteurs' 
      });
    }
    
    // Trouver le précepteur
    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur) {
      return res.json({ success: true, candidatures: [] });
    }
    
    // Récupérer toutes les candidatures
    const candidaturesDB = new (require('../utils/database').JSONDatabase)('candidatures.json');
    await candidaturesDB.init();
    
    const allCandidatures = await candidaturesDB.findAll();
    
    // Filtrer celles du précepteur connecté
    const mesCandidatures = allCandidatures.filter(c => 
      String(c.precepteur_id) === String(precepteur.id)
    );
    
    console.log(`📋 ${mesCandidatures.length} candidatures trouvées pour précepteur ${precepteur.id}`);
    
    res.json({
      success: true,
      candidatures: mesCandidatures
    });
    
  } catch (error) {
    console.error('❌ Erreur récupération candidatures:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur' 
    });
  }
});


// ============ ROUTES MANQUANTES ============

// ============ ROUTES MANQUANTES ============

// 🟢 CHANGER LE STATUT D'UNE CANDIDATURE
router.put('/candidatures/:id/status', authenticateToken, async (req, res) => {
  try {
    const { statut } = req.body;
    const candidaturesDB = await getCandidaturesDB();
    
    const candidature = await candidaturesDB.findById(req.params.id);
    if (!candidature) {
      return res.status(404).json({ success: false, error: 'Candidature non trouvée' });
    }
    
    await candidaturesDB.update(req.params.id, {
      statut,
      updated_at: new Date().toISOString()
    });
    
    console.log(`✅ Candidature ${req.params.id} -> ${statut}`);
    
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur mise à jour candidature:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 RÉCUPÉRER LES NÉGOCIATIONS D'UN CONTRAT
router.get('/contracts/:id/negotiations', authenticateToken, async (req, res) => {
  try {
    const { JSONDatabase } = require('../utils/database');
    const negotiationsDB = new JSONDatabase('negotiations.json');
    await negotiationsDB.init();
    
    const messages = await negotiationsDB.findAll({ 
      contract_id: req.params.id 
    });
    
    // Trier par date
    messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    res.json({ success: true, messages });
  } catch (error) {
    console.error('❌ Erreur récupération négociations:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 ENVOYER UN MESSAGE DE NÉGOCIATION
router.post('/contracts/:id/negotiations', authenticateToken, async (req, res) => {
  try {
    const { message, tarif_propose } = req.body;
    const { JSONDatabase } = require('../utils/database');
    const negotiationsDB = new JSONDatabase('negotiations.json');
    await negotiationsDB.init();
    
    // Déterminer l'expéditeur
    const sender = req.user.role === 'parent' ? 'parent' : 'precepteur';
    
    const newMessage = await negotiationsDB.create({
      contract_id: req.params.id,
      sender,
      user_id: req.user.id,
      message,
      tarif_propose: tarif_propose || null,
      created_at: new Date().toISOString()
    });
    
    console.log(`✅ Message négociation envoyé pour contrat ${req.params.id}`);
    
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error('❌ Erreur envoi négociation:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});
// 🟢 RÉCUPÉRER LES NÉGOCIATIONS D'UN CONTRAT
router.get('/contracts/:id/negotiations', authenticateToken, async (req, res) => {
  try {
    const { JSONDatabase } = require('../utils/database');
    const negotiationsDB = new JSONDatabase('negotiations.json');
    await negotiationsDB.init();
    
    const messages = await negotiationsDB.findAll({ 
      contract_id: req.params.id 
    });
    
    // Trier par date
    messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    res.json({ success: true, messages });
  } catch (error) {
    console.error('❌ Erreur récupération négociations:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 ENVOYER UN MESSAGE DE NÉGOCIATION
router.post('/contracts/:id/negotiations', authenticateToken, async (req, res) => {
  try {
    const { message, tarif_propose } = req.body;
    const { JSONDatabase } = require('../utils/database');
    const negotiationsDB = new JSONDatabase('negotiations.json');
    await negotiationsDB.init();
    
    // Déterminer l'expéditeur
    const sender = req.user.role === 'parent' ? 'parent' : 'precepteur';
    
    const newMessage = await negotiationsDB.create({
      contract_id: req.params.id,
      sender,
      user_id: req.user.id,
      message,
      tarif_propose: tarif_propose || null,
      created_at: new Date().toISOString()
    });
    
    console.log(`✅ Message négociation envoyé pour contrat ${req.params.id}`);
    
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error('❌ Erreur envoi négociation:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});



// ============ ROUTES SESSIONS ============

// Helper pour la DB sessions
async function getSessionsDB() {
  const { JSONDatabase } = require('../utils/database');
  const db = new JSONDatabase('sessions.json');
  await db.init();
  return db;
}

// Helper pour la DB session_files
async function getSessionFilesDB() {
  const { JSONDatabase } = require('../utils/database');
  const db = new JSONDatabase('session_files.json');
  await db.init();
  return db;
}

// Helper pour la DB session_grades
async function getSessionGradesDB() {
  const { JSONDatabase } = require('../utils/database');
  const db = new JSONDatabase('session_grades.json');
  await db.init();
  return db;
}

// 🟢 RÉCUPÉRER TOUTES LES SESSIONS D'UN PRÉCEPTEUR
router.get('/precepteur/sessions', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'precepteur') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' });
    }

    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur) {
      return res.json({ success: true, sessions: [] });
    }

    // Récupérer tous les contrats du précepteur
    const contratsDB = new (require('../utils/database').JSONDatabase)('contracts.json');
    await contratsDB.init();
    const contrats = await contratsDB.findAll({ precepteur_id: precepteur.id });
    const contratIds = contrats.map(c => c.id);

    if (contratIds.length === 0) {
      return res.json({ success: true, sessions: [] });
    }

    // Récupérer les sessions
    const sessionsDB = await getSessionsDB();
    let allSessions = await sessionsDB.findAll();
    
    // Filtrer par contrat_id
    const sessions = allSessions.filter(s => contratIds.includes(s.contract_id));

    // Trier par date (plus récent d'abord)
    sessions.sort((a, b) => new Date(b.date_session).getTime() - new Date(a.date_session).getTime());

    // Enrichir avec les infos des contrats
    const enriched = await Promise.all(sessions.map(async (session) => {
      const contrat = contrats.find(c => c.id === session.contract_id);
      let eleveInfo = null;
      let matiereInfo = null;
      
      if (contrat) {
        // Récupérer l'élève
        const elevesDB = new (require('../utils/database').JSONDatabase)('eleves.json');
        await elevesDB.init();
        if (contrat.eleve_id) {
          const eleve = await elevesDB.findById(contrat.eleve_id);
          if (eleve) {
            const { ...cleanEleve } = eleve;
            eleveInfo = cleanEleve;
          }
        }
        
        // Récupérer la matière
        const matieresDB = new (require('../utils/database').JSONDatabase)('matieres.json');
        await matieresDB.init();
        if (contrat.matiere_id) {
          const matiere = await matieresDB.findById(contrat.matiere_id);
          if (matiere) {
            matiereInfo = matiere;
          }
        }
      }

      return {
        ...session,
        contrat: contrat ? {
          id: contrat.id,
          titre: contrat.titre,
          matiere: contrat.matiere,
          niveau: contrat.niveau,
          frequence: contrat.frequence,
          tarif_final: contrat.tarif_final
        } : null,
        eleve: eleveInfo,
        matiere: matiereInfo
      };
    }));

    res.json({ success: true, sessions: enriched });
  } catch (error) {
    console.error('❌ Erreur récupération sessions:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 CRÉER UNE SESSION
// router.post('/precepteur/sessions', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'precepteur') {
//       return res.status(403).json({ success: false, error: 'Accès non autorisé' });
//     }

//     const { 
//       contract_id, 
//       date_session, 
//       heure_debut, 
//       heure_fin, 
//       lieu, 
//       notes_precepteur 
//     } = req.body;

//     if (!contract_id || !date_session || !heure_debut || !heure_fin || !lieu) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Tous les champs sont requis' 
//       });
//     }

//     // Vérifier que le contrat appartient au précepteur
//     const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
//     if (!precepteur) {
//       return res.status(404).json({ success: false, error: 'Précepteur non trouvé' });
//     }

//     const contratsDB = new (require('../utils/database').JSONDatabase)('contracts.json');
//     await contratsDB.init();
//     const contrat = await contratsDB.findById(contract_id);
    
//     if (!contrat || contrat.precepteur_id !== precepteur.id) {
//       return res.status(403).json({ success: false, error: 'Contrat non autorisé' });
//     }

//     // Calculer la durée
//     const [hDeb, mDeb] = heure_debut.split(':').map(Number);
//     const [hFin, mFin] = heure_fin.split(':').map(Number);
//     const dureeMinutes = (hFin * 60 + mFin) - (hDeb * 60 + mDeb);

//     if (dureeMinutes < 30) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'La durée minimale est de 30 minutes' 
//       });
//     }

//     const sessionsDB = await getSessionsDB();
//     const session = await sessionsDB.create({
//       contract_id: parseInt(contract_id),
//       date_session,
//       heure_debut,
//       heure_fin,
//       duree_minutes: dureeMinutes,
//       statut: 'planifie',
//       type_session: 'presentiel',
//       lieu,
//       lien_visio: null,
//       notes_precepteur: notes_precepteur || null,
//       notes_parent: null,
//       feedback_precepteur: null,
//       feedback_parent: null,
//       note_session: null,
//       raison_annulation: null,
//       annule_par: null,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString()
//     });

//     console.log(`✅ Session créée pour contrat ${contract_id}`);
//     res.status(201).json({ success: true, session });
//   } catch (error) {
//     console.error('❌ Erreur création session:', error);
//     res.status(500).json({ success: false, error: 'Erreur serveur' });
//   }
// });

// 🟢 RÉCUPÉRER LES SESSIONS D'UN CONTRAT SPÉCIFIQUE
router.get('/precepteur/contrats/:id/sessions', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'precepteur') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' });
    }

    const contractId = parseInt(req.params.id);
    
    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur) {
      return res.status(404).json({ success: false, error: 'Précepteur non trouvé' });
    }

    const sessionsDB = await getSessionsDB();
    const sessions = await sessionsDB.findAll({ contract_id: contractId });
    
    // Trier par date (plus récent d'abord)
    sessions.sort((a, b) => new Date(b.date_session).getTime() - new Date(a.date_session).getTime());

    res.json({ success: true, sessions });
  } catch (error) {
    console.error('❌ Erreur récupération sessions contrat:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 METTRE À JOUR LE STATUT D'UNE SESSION
router.patch('/precepteur/sessions/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'precepteur') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' });
    }

    const sessionId = parseInt(req.params.id);
    const { statut } = req.body;

    const validStatuses = ['planifie', 'en_cours', 'termine', 'annule', 'reporte'];
    if (!validStatuses.includes(statut)) {
      return res.status(400).json({ success: false, error: 'Statut invalide' });
    }

    const sessionsDB = await getSessionsDB();
    const session = await sessionsDB.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session non trouvée' });
    }

    // Vérifier que la session appartient au précepteur
    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur) {
      return res.status(404).json({ success: false, error: 'Précepteur non trouvé' });
    }

    const contratsDB = new (require('../utils/database').JSONDatabase)('contracts.json');
    await contratsDB.init();
    const contrat = await contratsDB.findById(session.contract_id);
    
    if (!contrat || contrat.precepteur_id !== precepteur.id) {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    await sessionsDB.update(sessionId, {
      statut,
      updated_at: new Date().toISOString()
    });

    console.log(`✅ Session ${sessionId} -> ${statut}`);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur mise à jour statut session:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 METTRE À JOUR LES NOTES D'UNE SESSION
router.put('/precepteur/sessions/:id/notes', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'precepteur') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' });
    }

    const sessionId = parseInt(req.params.id);
    const { notes_precepteur } = req.body;

    const sessionsDB = await getSessionsDB();
    const session = await sessionsDB.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session non trouvée' });
    }

    await sessionsDB.update(sessionId, {
      notes_precepteur,
      updated_at: new Date().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur mise à jour notes:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 UPLOADER UN FICHIER POUR UNE SESSION
// ============ ROUTES FICHIERS DE SESSION (CORRIGÉES - IDs en string) ============

// 🟢 UPLOADER UN FICHIER POUR UNE SESSION
router.post('/precepteur/sessions/:id/files', authenticateToken, documentUpload.single('fichier'), async (req, res) => {
  try {
    const sessionId = req.params.id; // ✅ Garder en string, pas parseInt

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Aucun fichier fourni' });
    }

    // Vérifier que la session existe
    const sessionsDB = await getSessionsDB();
    const session = await sessionsDB.findById(sessionId); // ✅ Chercher par string
    
    if (!session) {
      await fs.promises.unlink(req.file.path).catch(() => {});
      return res.status(404).json({ success: false, error: 'Session non trouvée' });
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

    const sessionFilesDB = await getSessionFilesDB();
    const file = await sessionFilesDB.create({
      session_id: sessionId, // ✅ String
      file_name: req.file.originalname,
      file_path: relativePath,
      file_url: fullUrl,
      file_type: fileType,
      file_size: req.file.size,
      uploaded_by: 'precepteur',
      created_at: new Date().toISOString()
    });

    console.log(`✅ Fichier uploadé pour session ${sessionId}`);
    res.status(201).json({ success: true, file });
  } catch (error) {
    console.error('❌ Erreur upload fichier session:', error);
    if (req.file) {
      await fs.promises.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 RÉCUPÉRER LES FICHIERS D'UNE SESSION
router.get('/precepteur/sessions/:id/files', authenticateToken, async (req, res) => {
  try {
    const sessionId = req.params.id; // ✅ Garder en string

    const sessionsDB = await getSessionsDB();
    const session = await sessionsDB.findById(sessionId); // ✅ String
    
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session non trouvée' });
    }

    const sessionFilesDB = await getSessionFilesDB();
    let files = [];
    try {
      const allFiles = await sessionFilesDB.findAll();
      // ✅ Filtrer par session_id en string
      files = allFiles.filter(f => String(f.session_id) === String(sessionId));
    } catch (err) {
      return res.json({ success: true, files: [] });
    }

    files.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({ success: true, files });
  } catch (error) {
    console.error('❌ Erreur récupération fichiers:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 SUPPRIMER UN FICHIER
router.delete('/precepteur/sessions/files/:id', authenticateToken, async (req, res) => {
  try {
    const fileId = req.params.id; // ✅ Garder en string

    const sessionFilesDB = await getSessionFilesDB();
    const file = await sessionFilesDB.findById(fileId); // ✅ String
    
    if (!file) {
      return res.status(404).json({ success: false, error: 'Fichier non trouvé' });
    }

    if (file.file_path) {
      const filePath = path.join(config.uploadPath, '..', file.file_path);
      await fs.promises.unlink(filePath).catch(err => {
        console.warn('⚠️ Impossible de supprimer le fichier:', err.message);
      });
    }

    await sessionFilesDB.delete(fileId); // ✅ String
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur suppression fichier:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// ============ ROUTES COTATIONS (CORRIGÉES - IDs en string) ============

// 🟢 RÉCUPÉRER LES COTATIONS D'UNE SESSION
router.get('/precepteur/sessions/:id/grades', authenticateToken, async (req, res) => {
  try {
    const sessionId = req.params.id; // ✅ Garder en string

    const sessionGradesDB = await getSessionGradesDB();
    let grades = [];
    try {
      const allGrades = await sessionGradesDB.findAll();
      // ✅ Filtrer par session_id en string
      grades = allGrades.filter(g => String(g.session_id) === String(sessionId));
    } catch (err) {
      return res.json({ success: true, grades: [] });
    }

    grades.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    let moyenne = 0;
    if (grades.length > 0) {
      const total = grades.reduce((acc, g) => acc + (g.score / g.max_score) * 20, 0);
      moyenne = total / grades.length;
    }

    res.json({ success: true, grades, total: grades.length, moyenne: Math.round(moyenne * 10) / 10 });
  } catch (error) {
    console.error('❌ Erreur récupération cotations:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 AJOUTER UNE COTATION
router.post('/precepteur/sessions/:id/grades', authenticateToken, async (req, res) => {
  try {
    const sessionId = req.params.id; // ✅ Garder en string
    const { titre, score, max_score, comment } = req.body;

    if (!titre || score === undefined || max_score === undefined) {
      return res.status(400).json({ success: false, error: 'Titre, score et max_score requis' });
    }

    const sessionsDB = await getSessionsDB();
    const session = await sessionsDB.findById(sessionId); // ✅ String
    
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session non trouvée' });
    }

    const sessionGradesDB = await getSessionGradesDB();
    const grade = await sessionGradesDB.create({
      session_id: sessionId, // ✅ String
      titre,
      score: parseFloat(score),
      max_score: parseFloat(max_score),
      comment: comment || null,
      created_at: new Date().toISOString()
    });

    res.status(201).json({ success: true, grade });
  } catch (error) {
    console.error('❌ Erreur ajout cotation:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 MODIFIER UNE COTATION
router.put('/precepteur/sessions/grades/:id', authenticateToken, async (req, res) => {
  try {
    const gradeId = req.params.id; // ✅ Garder en string
    const { titre, score, max_score, comment } = req.body;

    const sessionGradesDB = await getSessionGradesDB();
    const grade = await sessionGradesDB.findById(gradeId); // ✅ String
    
    if (!grade) {
      return res.status(404).json({ success: false, error: 'Cotation non trouvée' });
    }

    const updates = {};
    if (titre !== undefined) updates.titre = titre;
    if (score !== undefined) updates.score = parseFloat(score);
    if (max_score !== undefined) updates.max_score = parseFloat(max_score);
    if (comment !== undefined) updates.comment = comment || null;

    await sessionGradesDB.update(gradeId, updates); // ✅ String
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur modification cotation:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 SUPPRIMER UNE COTATION
router.delete('/precepteur/sessions/grades/:id', authenticateToken, async (req, res) => {
  try {
    const gradeId = req.params.id; // ✅ Garder en string

    const sessionGradesDB = await getSessionGradesDB();
    const grade = await sessionGradesDB.findById(gradeId); // ✅ String
    
    if (!grade) {
      return res.status(404).json({ success: false, error: 'Cotation non trouvée' });
    }

    await sessionGradesDB.delete(gradeId); // ✅ String
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur suppression cotation:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 RÉCUPÉRER LES COTATIONS D'UNE SESSION
router.get('/precepteur/sessions/:id/grades', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'precepteur') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' });
    }

    const sessionId = parseInt(req.params.id);

    const sessionGradesDB = await getSessionGradesDB();
    const grades = await sessionGradesDB.findAll({ session_id: sessionId });
    
    // Trier par date (plus récent d'abord)
    grades.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({ success: true, grades });
  } catch (error) {
    console.error('❌ Erreur récupération cotations:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 MODIFIER UNE COTATION
router.put('/precepteur/sessions/grades/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'precepteur') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' });
    }

    const gradeId = parseInt(req.params.id);
    const { titre, score, max_score, comment } = req.body;

    const sessionGradesDB = await getSessionGradesDB();
    const grade = await sessionGradesDB.findById(gradeId);
    
    if (!grade) {
      return res.status(404).json({ success: false, error: 'Cotation non trouvée' });
    }

    await sessionGradesDB.update(gradeId, {
      titre: titre || grade.titre,
      score: score !== undefined ? parseFloat(score) : grade.score,
      max_score: max_score !== undefined ? parseFloat(max_score) : grade.max_score,
      comment: comment !== undefined ? comment : grade.comment
    });

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur modification cotation:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 SUPPRIMER UNE COTATION
router.delete('/precepteur/sessions/grades/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'precepteur') {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' });
    }

    const gradeId = parseInt(req.params.id);

    const sessionGradesDB = await getSessionGradesDB();
    const grade = await sessionGradesDB.findById(gradeId);
    
    if (!grade) {
      return res.status(404).json({ success: false, error: 'Cotation non trouvée' });
    }

    await sessionGradesDB.delete(gradeId);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur suppression cotation:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});






// ============ CORRECTIONS DANS auth.js ============

// 🟢 RÉCUPÉRER UNE SESSION PAR ID (AJOUTER CETTE ROUTE SI ELLE N'EXISTE PAS)
router.get('/precepteur/sessions/:id', authenticateToken, async (req, res) => {
  try {
    const sessionId = req.params.id; // ✅ Garder en string

    const sessionsDB = await getSessionsDB();
    const session = await sessionsDB.findById(sessionId); // ✅ String

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session non trouvée' });
    }

    res.json({ success: true, session });
  } catch (error) {
    console.error('❌ Erreur récupération session:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 METTRE À JOUR LE STATUT D'UNE SESSION (CORRIGÉE)
router.patch('/precepteur/sessions/:id/status', authenticateToken, async (req, res) => {
  try {
    const sessionId = req.params.id; // ✅ Garder en string, NE PAS utiliser parseInt
    const { statut } = req.body;

    console.log('📝 Changement statut session:', { sessionId, statut });

    const validStatuses = ['planifie', 'en_cours', 'termine', 'annule', 'reporte'];
    if (!validStatuses.includes(statut)) {
      return res.status(400).json({ success: false, error: 'Statut invalide' });
    }

    const sessionsDB = await getSessionsDB();
    
    // ✅ Chercher par ID string
    const session = await sessionsDB.findById(sessionId);
    
    if (!session) {
      console.log('❌ Session non trouvée:', sessionId);
      return res.status(404).json({ success: false, error: 'Session non trouvée' });
    }

    console.log('✅ Session trouvée:', session.id, 'Statut actuel:', session.statut);

    // Mettre à jour
    await sessionsDB.update(sessionId, {
      statut,
      updated_at: new Date().toISOString()
    });

    console.log(`✅ Session ${sessionId}: ${session.statut} → ${statut}`);
    res.json({ success: true, message: `Session ${statut.replace('_', ' ')} avec succès` });
  } catch (error) {
    console.error('❌ Erreur mise à jour statut session:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 METTRE À JOUR LES NOTES D'UNE SESSION (CORRIGÉE)
router.put('/precepteur/sessions/:id/notes', authenticateToken, async (req, res) => {
  try {
    const sessionId = req.params.id; // ✅ Garder en string
    const { notes_precepteur } = req.body;

    console.log('📝 Mise à jour notes session:', { sessionId });

    const sessionsDB = await getSessionsDB();
    
    // ✅ Chercher par ID string
    const session = await sessionsDB.findById(sessionId);
    
    if (!session) {
      console.log('❌ Session non trouvée:', sessionId);
      return res.status(404).json({ success: false, error: 'Session non trouvée' });
    }

    await sessionsDB.update(sessionId, {
      notes_precepteur: notes_precepteur || null,
      updated_at: new Date().toISOString()
    });

    console.log(`✅ Notes mises à jour pour session ${sessionId}`);
    res.json({ success: true, message: 'Notes sauvegardées avec succès' });
  } catch (error) {
    console.error('❌ Erreur mise à jour notes:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});


// // 🟢 RÉCUPÉRER LES SESSIONS POUR UN PARENT
// router.get('/parent/sessions', authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'parent') {
//       return res.status(403).json({ success: false, error: 'Accès réservé aux parents' });
//     }

//     // Trouver le parent
//     const parentsDB = new (require('../utils/database').JSONDatabase)('parents.json');
//     await parentsDB.init();
//     const parent = await parentsDB.findOne({ user_id: req.user.id });
    
//     if (!parent) {
//       return res.json({ success: true, sessions: [] });
//     }

//     // Récupérer les contrats du parent
//     const contratsDB = new (require('../utils/database').JSONDatabase)('contracts.json');
//     await contratsDB.init();
//     const allContrats = await contratsDB.findAll();
    
//     const mesContrats = allContrats.filter(c => String(c.parent_id) === String(parent.id));
    
//     console.log(`📊 Contrats du parent ${parent.id}: ${mesContrats.length}`);

//     if (mesContrats.length === 0) {
//       return res.json({ success: true, sessions: [] });
//     }

//     const contratIds = mesContrats.map(c => String(c.id));

//     // Récupérer toutes les sessions
//     const sessionsDB = new (require('../utils/database').JSONDatabase)('sessions.json');
//     await sessionsDB.init();
//     let allSessions = [];
    
//     try {
//       allSessions = await sessionsDB.findAll();
//     } catch (err) {
//       return res.json({ success: true, sessions: [] });
//     }

//     console.log(`📊 Total sessions dans la DB: ${allSessions.length}`);
//     console.log(`📊 IDs contrats du parent:`, contratIds);
    
//     // Filtrer les sessions des contrats du parent
//     const sessions = allSessions.filter(s => {
//       const sessionContractId = String(s.contract_id);
//       const match = contratIds.includes(sessionContractId);
//       return match;
//     });

//     console.log(`✅ ${sessions.length} sessions trouvées pour le parent`);

//     // Trier par date
//     sessions.sort((a, b) => new Date(b.date_session).getTime() - new Date(a.date_session).getTime());

//     // Enrichir avec les infos
//     const elevesDB = new (require('../utils/database').JSONDatabase)('eleves.json');
//     await elevesDB.init();
//     const matieresDB = new (require('../utils/database').JSONDatabase)('matieres.json');
//     await matieresDB.init();
//     const usersDB = require('../utils/database').usersDB;

//     const enriched = await Promise.all(sessions.map(async (session) => {
//       const contrat = mesContrats.find(c => String(c.id) === String(session.contract_id));
      
//       let eleveInfo = null;
//       let matiereInfo = null;
//       let precepteurInfo = null;
      
//       if (contrat) {
//         // Récupérer l'élève
//         if (contrat.eleve_id) {
//           eleveInfo = await elevesDB.findById(contrat.eleve_id);
//         }
        
//         // Récupérer la matière
//         if (contrat.matiere_id) {
//           matiereInfo = await matieresDB.findById(contrat.matiere_id);
//         }

//         // Récupérer le précepteur
//         const precepteursDB = require('../utils/database').precepteursDB;
//         const precepteur = await precepteursDB.findById(contrat.precepteur_id);
//         if (precepteur) {
//           const precepteurUser = await usersDB.findById(precepteur.user_id);
//           if (precepteurUser) {
//             const { password, ...clean } = precepteurUser;
//             precepteurInfo = {
//               id: precepteur.id,
//               username: clean.username,
//               email: clean.email,
//               telephone: clean.telephone,
//               photo_profil: clean.photo_profil,
//               commune: precepteur.commune,
//               note_moyenne: precepteur.note_moyenne
//             };
//           }
//         }
//       }

//       return {
//         ...session,
//         contrat: contrat ? {
//           id: contrat.id,
//           titre: contrat.titre,
//           matiere: contrat.matiere,
//           niveau: contrat.niveau,
//           frequence: contrat.frequence,
//           tarif_final: contrat.tarif_final,
//           statut: contrat.statut
//         } : null,
//         eleve: eleveInfo,
//         matiere: matiereInfo,
//         precepteur: precepteurInfo
//       };
//     }));

//     res.json({ success: true, sessions: enriched });
//   } catch (error) {
//     console.error('❌ Erreur sessions parent:', error);
//     res.status(500).json({ success: false, error: 'Erreur serveur' });
//   }
// });
// 🟢 RÉCUPÉRER LES SESSIONS POUR UN PARENT (AVEC FICHIERS ET COTATIONS)
router.get('/parent/sessions', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ success: false, error: 'Accès réservé aux parents' });
    }

    // Trouver le parent
    const parentsDB = new (require('../utils/database').JSONDatabase)('parents.json');
    await parentsDB.init();
    const parent = await parentsDB.findOne({ user_id: req.user.id });
    
    if (!parent) {
      return res.json({ success: true, sessions: [] });
    }

    // Récupérer les contrats du parent
    const contratsDB = new (require('../utils/database').JSONDatabase)('contracts.json');
    await contratsDB.init();
    const allContrats = await contratsDB.findAll();
    
    const mesContrats = allContrats.filter(c => String(c.parent_id) === String(parent.id));
    
    console.log(`📊 Contrats du parent ${parent.id}: ${mesContrats.length}`);

    if (mesContrats.length === 0) {
      return res.json({ success: true, sessions: [] });
    }

    const contratIds = mesContrats.map(c => String(c.id));

    // Récupérer toutes les sessions
    const sessionsDB = new (require('../utils/database').JSONDatabase)('sessions.json');
    await sessionsDB.init();
    let allSessions = [];
    
    try {
      allSessions = await sessionsDB.findAll();
    } catch (err) {
      return res.json({ success: true, sessions: [] });
    }

    console.log(`📊 Total sessions dans la DB: ${allSessions.length}`);
    
    // Filtrer les sessions des contrats du parent
    const sessions = allSessions.filter(s => {
      const sessionContractId = String(s.contract_id);
      return contratIds.includes(sessionContractId);
    });

    console.log(`✅ ${sessions.length} sessions trouvées pour le parent`);

    // Trier par date
    sessions.sort((a, b) => new Date(b.date_session).getTime() - new Date(a.date_session).getTime());

    // Initialiser les DBs pour l'enrichissement
    const elevesDB = new (require('../utils/database').JSONDatabase)('eleves.json');
    await elevesDB.init();
    const matieresDB = new (require('../utils/database').JSONDatabase)('matieres.json');
    await matieresDB.init();
    
    // ✅ Initialiser les DBs pour les fichiers et cotations
    const sessionFilesDB = await getSessionFilesDB();
    const sessionGradesDB = await getSessionGradesDB();
    
    // Récupérer tous les fichiers et cotations
    let allFiles = [];
    let allGrades = [];
    
    try {
      allFiles = await sessionFilesDB.findAll();
    } catch (err) {
      console.warn('⚠️ Impossible de charger les fichiers:', err.message);
    }
    
    try {
      allGrades = await sessionGradesDB.findAll();
    } catch (err) {
      console.warn('⚠️ Impossible de charger les cotations:', err.message);
    }

    console.log(`📁 ${allFiles.length} fichiers chargés`);
    console.log(`📝 ${allGrades.length} cotations chargées`);

    // Enrichir chaque session
    const enriched = await Promise.all(sessions.map(async (session) => {
      const contrat = mesContrats.find(c => String(c.id) === String(session.contract_id));
      
      let eleveInfo = null;
      let matiereInfo = null;
      let precepteurInfo = null;
      
      if (contrat) {
        // Récupérer l'élève
        if (contrat.eleve_id) {
          try {
            eleveInfo = await elevesDB.findById(contrat.eleve_id);
          } catch (err) {
            console.warn(`⚠️ Élève non trouvé: ${contrat.eleve_id}`);
          }
        }
        
        // Récupérer la matière
        if (contrat.matiere_id) {
          try {
            matiereInfo = await matieresDB.findById(contrat.matiere_id);
          } catch (err) {
            console.warn(`⚠️ Matière non trouvée: ${contrat.matiere_id}`);
          }
        }

        // Récupérer le précepteur
        try {
          const precepteursDB = require('../utils/database').precepteursDB;
          const precepteur = await precepteursDB.findById(contrat.precepteur_id);
          if (precepteur) {
            const precepteurUser = await usersDB.findById(precepteur.user_id);
            if (precepteurUser) {
              const { password, ...clean } = precepteurUser;
              precepteurInfo = {
                id: precepteur.id,
                username: clean.username,
                email: clean.email,
                telephone: clean.telephone,
                photo_profil: clean.photo_profil,
                commune: precepteur.commune,
                note_moyenne: precepteur.note_moyenne
              };
            }
          }
        } catch (err) {
          console.warn(`⚠️ Précepteur non trouvé pour contrat ${contrat.id}`);
        }
      }

      // ✅ Filtrer les fichiers de cette session
      const sessionFiles = allFiles.filter(f => 
        String(f.session_id) === String(session.id)
      );
      
      // ✅ Filtrer les cotations de cette session
      const sessionGrades = allGrades.filter(g => 
        String(g.session_id) === String(session.id)
      );

      console.log(`📎 Session ${session.id}: ${sessionFiles.length} fichiers, ${sessionGrades.length} cotations`);

      return {
        ...session,
        contrat: contrat ? {
          id: contrat.id,
          titre: contrat.titre,
          matiere: contrat.matiere,
          niveau: contrat.niveau,
          frequence: contrat.frequence,
          tarif_final: contrat.tarif_final,
          statut: contrat.statut
        } : null,
        eleve: eleveInfo,
        matiere: matiereInfo,
        precepteur: precepteurInfo,
        // ✅ Inclure les fichiers et cotations
        files: sessionFiles,
        grades: sessionGrades,
        files_count: sessionFiles.length,
        grades_count: sessionGrades.length
      };
    }));

    console.log(`📤 Retourne ${enriched.length} sessions enrichies avec fichiers et cotations`);
    
    // Vérifier combien de sessions ont des fichiers/cotations
    const sessionsWithFiles = enriched.filter(s => s.files && s.files.length > 0).length;
    const sessionsWithGrades = enriched.filter(s => s.grades && s.grades.length > 0).length;
    console.log(`  - ${sessionsWithFiles} sessions avec fichiers`);
    console.log(`  - ${sessionsWithGrades} sessions avec cotations`);

    res.json({ success: true, sessions: enriched });
  } catch (error) {
    console.error('❌ Erreur sessions parent:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});


// ============ ROUTES CANDIDATURES PARENTS → SERVICES PRÉCEPTEURS ============

// Helper pour la DB candidatures_parents
async function getCandidaturesParentsDB() {
  const { JSONDatabase } = require('../utils/database');
  const db = new JSONDatabase('candidatures_parents.json');
  await db.init();
  return db;
}

// 🟢 PARENT - POSTULER À UN SERVICE PRÉCEPTEUR
router.post('/parent/candidatures', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ success: false, error: 'Réservé aux parents' });
    }

    const { service_precepteur_id, eleve_id, message, tarif_propose } = req.body;

    if (!service_precepteur_id || !eleve_id || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'service_precepteur_id, eleve_id et message sont requis' 
      });
    }

    // Trouver le parent
    const parentsDB = new (require('../utils/database').JSONDatabase)('parents.json');
    await parentsDB.init();
    const parent = await parentsDB.findOne({ user_id: req.user.id });
    
    if (!parent) {
      return res.status(404).json({ success: false, error: 'Parent non trouvé' });
    }

    // Vérifier que l'élève appartient au parent
    const elevesDB = new (require('../utils/database').JSONDatabase)('eleves.json');
    await elevesDB.init();
    const eleve = await elevesDB.findById(eleve_id);
    
    if (!eleve || String(eleve.parent_id) !== String(parent.id)) {
      return res.status(403).json({ success: false, error: 'Cet élève ne vous appartient pas' });
    }

    // Vérifier que le service existe
    const servicesDB = new (require('../utils/database').JSONDatabase)('services_precepteur.json');
    await servicesDB.init();
    const service = await servicesDB.findById(service_precepteur_id);
    
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service non trouvé' });
    }

    // Vérifier si déjà postulé
    const candidaturesDB = await getCandidaturesParentsDB();
    const existing = await candidaturesDB.findOne({ 
      service_precepteur_id: String(service_precepteur_id),
      parent_id: String(parent.id)
    });
    
    if (existing) {
      return res.status(400).json({ success: false, error: 'Vous avez déjà postulé à ce service' });
    }

    const candidature = await candidaturesDB.create({
      service_precepteur_id: String(service_precepteur_id),
      parent_id: String(parent.id),
      eleve_id: String(eleve_id),
      message,
      tarif_propose: tarif_propose || null,
      statut: 'en_attente',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    console.log(`✅ Candidature parent créée: ${candidature.id}`);
    res.status(201).json({ success: true, candidature });

  } catch (error) {
    console.error('❌ Erreur candidature parent:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 PRÉCEPTEUR - VOIR LES CANDIDATURES REÇUES SUR MES SERVICES
router.get('/precepteur/candidatures', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'precepteur') {
      return res.status(403).json({ success: false, error: 'Réservé aux précepteurs' });
    }

    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur) {
      return res.json({ success: true, candidatures: [] });
    }

    // Récupérer les services du précepteur
    const servicesDB = new (require('../utils/database').JSONDatabase)('services_precepteur.json');
    await servicesDB.init();
    const mesServices = await servicesDB.findAll({ precepteur_id: precepteur.id });
    const serviceIds = mesServices.map(s => String(s.id));

    if (serviceIds.length === 0) {
      return res.json({ success: true, candidatures: [] });
    }

    // Récupérer les candidatures
    const candidaturesDB = await getCandidaturesParentsDB();
    const allCandidatures = await candidaturesDB.findAll();
    
    const candidatures = allCandidatures.filter(c => 
      serviceIds.includes(String(c.service_precepteur_id))
    );

    // Enrichir
    const parentsDB = new (require('../utils/database').JSONDatabase)('parents.json');
    await parentsDB.init();
    const elevesDB = new (require('../utils/database').JSONDatabase)('eleves.json');
    await elevesDB.init();

    const enriched = await Promise.all(candidatures.map(async (c) => {
      const service = mesServices.find(s => String(s.id) === String(c.service_precepteur_id));
      const parent = await parentsDB.findById(c.parent_id);
      const eleve = await elevesDB.findById(c.eleve_id);
      
      let parentUser = null;
      if (parent) {
        const user = await usersDB.findById(parent.user_id);
        if (user) {
          const { password, ...clean } = user;
          parentUser = clean;
        }
      }

      return {
        ...c,
        service: service ? { id: service.id, titre: service.titre, tarif_horaire: service.tarif_horaire } : null,
        parent: parent ? { ...parent, user: parentUser } : null,
        eleve: eleve
      };
    }));

    // Trier par date
    enriched.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({ success: true, candidatures: enriched });

  } catch (error) {
    console.error('❌ Erreur candidatures précepteur:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 PARENT - VOIR MES CANDIDATURES
router.get('/parent/candidatures', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ success: false, error: 'Réservé aux parents' });
    }

    const parentsDB = new (require('../utils/database').JSONDatabase)('parents.json');
    await parentsDB.init();
    const parent = await parentsDB.findOne({ user_id: req.user.id });
    
    if (!parent) {
      return res.json({ success: true, candidatures: [] });
    }

    const candidaturesDB = await getCandidaturesParentsDB();
    const allCandidatures = await candidaturesDB.findAll();
    
    const mesCandidatures = allCandidatures.filter(c => 
      String(c.parent_id) === String(parent.id)
    );

    // Enrichir
    const servicesDB = new (require('../utils/database').JSONDatabase)('services_precepteur.json');
    await servicesDB.init();
    const elevesDB = new (require('../utils/database').JSONDatabase)('eleves.json');
    await elevesDB.init();

    const enriched = await Promise.all(mesCandidatures.map(async (c) => {
      const service = await servicesDB.findById(c.service_precepteur_id);
      const eleve = await elevesDB.findById(c.eleve_id);
      
      let precepteurInfo = null;
      if (service) {
        const precepteur = await precepteursDB.findById(service.precepteur_id);
        if (precepteur) {
          const user = await usersDB.findById(precepteur.user_id);
          if (user) {
            const { password, ...clean } = user;
            precepteurInfo = { ...precepteur, user: clean };
          }
        }
      }

      return {
        ...c,
        service: service,
        eleve: eleve,
        precepteur: precepteurInfo
      };
    }));

    enriched.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({ success: true, candidatures: enriched });

  } catch (error) {
    console.error('❌ Erreur candidatures parent:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 CHANGER LE STATUT D'UNE CANDIDATURE PARENT
router.put('/parent/candidatures/:id/status', authenticateToken, async (req, res) => {
  try {
    const { statut } = req.body;
    
    if (!['accepte', 'refuse'].includes(statut)) {
      return res.status(400).json({ success: false, error: 'Statut invalide. Utilisez: accepte, refuse' });
    }

    const candidaturesDB = await getCandidaturesParentsDB();
    const candidature = await candidaturesDB.findById(req.params.id);
    
    if (!candidature) {
      return res.status(404).json({ success: false, error: 'Candidature non trouvée' });
    }

    // Vérifier que le précepteur est propriétaire du service
    const servicesDB = new (require('../utils/database').JSONDatabase)('services_precepteur.json');
    await servicesDB.init();
    const service = await servicesDB.findById(candidature.service_precepteur_id);
    
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service non trouvé' });
    }

    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur || String(service.precepteur_id) !== String(precepteur.id)) {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    await candidaturesDB.update(req.params.id, {
      statut,
      updated_at: new Date().toISOString()
    });

    console.log(`✅ Candidature parent ${req.params.id} -> ${statut}`);
    res.json({ success: true, message: `Candidature ${statut}` });

  } catch (error) {
    console.error('❌ Erreur statut candidature:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 CRÉER UN CONTRAT DEPUIS UNE CANDIDATURE PARENT
router.post('/parent/candidatures/:id/contrat', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'precepteur') {
      return res.status(403).json({ success: false, error: 'Réservé aux précepteurs' });
    }

    const candidatureId = req.params.id;
    const { date_debut, duree, tarif_final, notes } = req.body;

    if (!date_debut) {
      return res.status(400).json({ success: false, error: 'date_debut est requis' });
    }

    // Récupérer la candidature
    const candidaturesDB = await getCandidaturesParentsDB();
    const candidature = await candidaturesDB.findById(candidatureId);
    
    if (!candidature) {
      return res.status(404).json({ success: false, error: 'Candidature non trouvée' });
    }

    // Récupérer le service
    const servicesDB = new (require('../utils/database').JSONDatabase)('services_precepteur.json');
    await servicesDB.init();
    const service = await servicesDB.findById(candidature.service_precepteur_id);
    
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service non trouvé' });
    }

    // Vérifier que le précepteur est propriétaire
    const precepteur = await precepteursDB.findOne({ user_id: req.user.id });
    if (!precepteur || String(service.precepteur_id) !== String(precepteur.id)) {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    // Créer le contrat
    const contractsDB = new (require('../utils/database').JSONDatabase)('contracts.json');
    await contractsDB.init();

    const contrat = await contractsDB.create({
      service_precepteur_id: candidature.service_precepteur_id,
      parent_id: candidature.parent_id,
      precepteur_id: precepteur.id,
      titre: service.titre,
      matiere: null,
      niveau: '',
      frequence: 'hebdomadaire',
      lieu: service.modalite === 'presentiel' ? 'Domicile' : 'En ligne',
      date_debut,
      duree: duree || '1_mois',
      tarif_final: tarif_final || candidature.tarif_propose || service.tarif_horaire || 0,
      notes: notes || null,
      statut: 'en_attente',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Mettre à jour le statut de la candidature
    await candidaturesDB.update(candidatureId, {
      statut: 'accepte',
      updated_at: new Date().toISOString()
    });

    console.log(`✅ Contrat créé depuis candidature parent: ${contrat.id}`);
    res.status(201).json({ success: true, contrat });

  } catch (error) {
    console.error('❌ Erreur création contrat:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});


// ============ ROUTES NOTATION PRÉCEPTEUR ============

// Helper pour la DB ratings
async function getRatingsDB() {
  const { JSONDatabase } = require('../utils/database');
  const db = new JSONDatabase('precepteur_ratings.json');
  await db.init();
  return db;
}

// 🟢 CRÉER OU MODIFIER UNE NOTE POUR UN PRÉCEPTEUR (par un parent)
router.post('/precepteur/ratings', authenticateToken, async (req, res) => {
  try {
    // Vérifier que c'est un parent
    if (req.user.role !== 'parent') {
      return res.status(403).json({ success: false, error: 'Seuls les parents peuvent noter un précepteur' });
    }

    const { contract_id, precepteur_id, note, commentaire } = req.body;

    // Validation
    if (!contract_id || !precepteur_id || !note) {
      return res.status(400).json({ 
        success: false, 
        error: 'contract_id, precepteur_id et note sont requis' 
      });
    }

    if (note < 1 || note > 5 || !Number.isInteger(note)) {
      return res.status(400).json({ 
        success: false, 
        error: 'La note doit être un entier entre 1 et 5' 
      });
    }

    // Trouver le parent
    const parentsDB = new (require('../utils/database').JSONDatabase)('parents.json');
    await parentsDB.init();
    const parent = await parentsDB.findOne({ user_id: req.user.id });
    
    if (!parent) {
      return res.status(404).json({ success: false, error: 'Parent non trouvé' });
    }

    // Vérifier que le contrat existe et appartient au parent
    const contratsDB = new (require('../utils/database').JSONDatabase)('contracts.json');
    await contratsDB.init();
    const contrat = await contratsDB.findById(String(contract_id));
    
    if (!contrat) {
      return res.status(404).json({ success: false, error: 'Contrat non trouvé' });
    }

    if (String(contrat.parent_id) !== String(parent.id)) {
      return res.status(403).json({ success: false, error: 'Ce contrat ne vous appartient pas' });
    }

    // Vérifier que le précepteur existe
    const precepteur = await precepteursDB.findById(String(precepteur_id));
    if (!precepteur) {
      return res.status(404).json({ success: false, error: 'Précepteur non trouvé' });
    }

    // Vérifier si le parent a déjà noté ce contrat
    const ratingsDB = await getRatingsDB();
    const existingRating = await ratingsDB.findOne({ 
      contract_id: String(contract_id),
      parent_id: String(parent.id)
    });

    if (existingRating) {
      return res.status(400).json({ 
        success: false, 
        error: 'Vous avez déjà noté ce contrat. Utilisez PUT pour modifier.' 
      });
    }

    // Créer la note
    const rating = await ratingsDB.create({
      contract_id: String(contract_id),
      precepteur_id: String(precepteur_id),
      parent_id: String(parent.id),
      note,
      commentaire: commentaire || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Mettre à jour la note moyenne du précepteur
    await updatePrecepteurAverageRating(String(precepteur_id));

    console.log(`✅ Note créée: ${rating.id} - ${note}/5 pour précepteur ${precepteur_id}`);
    
    res.status(201).json({ success: true, rating });

  } catch (error) {
    console.error('❌ Erreur création note:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 MODIFIER UNE NOTE EXISTANTE
router.put('/precepteur/ratings/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ success: false, error: 'Seuls les parents peuvent modifier une note' });
    }

    const ratingId = req.params.id;
    const { note, commentaire } = req.body;

    if (note && (note < 1 || note > 5 || !Number.isInteger(note))) {
      return res.status(400).json({ 
        success: false, 
        error: 'La note doit être un entier entre 1 et 5' 
      });
    }

    const ratingsDB = await getRatingsDB();
    const rating = await ratingsDB.findById(ratingId);
    
    if (!rating) {
      return res.status(404).json({ success: false, error: 'Note non trouvée' });
    }

    // Vérifier que le parent est le propriétaire
    const parentsDB = new (require('../utils/database').JSONDatabase)('parents.json');
    await parentsDB.init();
    const parent = await parentsDB.findOne({ user_id: req.user.id });
    
    if (!parent || String(rating.parent_id) !== String(parent.id)) {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    // Mettre à jour
    const updates = {
      updated_at: new Date().toISOString()
    };
    if (note) updates.note = note;
    if (commentaire !== undefined) updates.commentaire = commentaire;

    await ratingsDB.update(ratingId, updates);

    // Mettre à jour la note moyenne du précepteur
    await updatePrecepteurAverageRating(String(rating.precepteur_id));

    console.log(`✅ Note modifiée: ${ratingId}`);
    
    res.json({ success: true, message: 'Note modifiée avec succès' });

  } catch (error) {
    console.error('❌ Erreur modification note:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 RÉCUPÉRER LES NOTES D'UN PRÉCEPTEUR (par precepteur_id)
router.get('/precepteur/ratings/:precepteurId', async (req, res) => {
  try {
    const ratingsDB = await getRatingsDB();
    const allRatings = await ratingsDB.findAll();
    
    const ratings = allRatings.filter(r => 
      String(r.precepteur_id) === String(req.params.precepteurId)
    );

    // Calculer la moyenne
    const moyenne = ratings.length > 0 
      ? ratings.reduce((acc, r) => acc + r.note, 0) / ratings.length 
      : 0;

    res.json({ 
      success: true, 
      ratings,
      total: ratings.length,
      moyenne: Math.round(moyenne * 10) / 10
    });

  } catch (error) {
    console.error('❌ Erreur récupération notes:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 RÉCUPÉRER LA NOTE D'UN PARENT POUR UN CONTRAT SPÉCIFIQUE
router.get('/precepteur/ratings', authenticateToken, async (req, res) => {
  try {
    const { contract_id } = req.query;

    if (!contract_id) {
      return res.status(400).json({ success: false, error: 'contract_id est requis' });
    }

    // Trouver le parent
    const parentsDB = new (require('../utils/database').JSONDatabase)('parents.json');
    await parentsDB.init();
    const parent = await parentsDB.findOne({ user_id: req.user.id });

    if (!parent) {
      return res.json({ success: true, rating: null });
    }

    const ratingsDB = await getRatingsDB();
    const rating = await ratingsDB.findOne({ 
      contract_id: String(contract_id),
      parent_id: String(parent.id)
    });

    res.json({ success: true, rating: rating || null });

  } catch (error) {
    console.error('❌ Erreur récupération note:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Helper pour mettre à jour la note moyenne du précepteur
async function updatePrecepteurAverageRating(precepteurId) {
  try {
    const ratingsDB = await getRatingsDB();
    const allRatings = await ratingsDB.findAll();
    
    const precepteurRatings = allRatings.filter(r => 
      String(r.precepteur_id) === String(precepteurId)
    );

    const moyenne = precepteurRatings.length > 0
      ? precepteurRatings.reduce((acc, r) => acc + r.note, 0) / precepteurRatings.length
      : 0;

    await precepteursDB.update(precepteurId, {
      note_moyenne: Math.round(moyenne * 10) / 10,
      updated_at: new Date().toISOString()
    });

    console.log(`📊 Note moyenne mise à jour pour précepteur ${precepteurId}: ${Math.round(moyenne * 10) / 10}/5`);
  } catch (error) {
    console.error('❌ Erreur mise à jour note moyenne:', error);
  }
}

// routes/auth.js - Ajouter ces routes

// 🟢 PARENT - RÉCUPÉRER LE PROFIL PARENT
router.get('/parent/profile', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ success: false, error: 'Réservé aux parents' });
    }

    const parentsDB = new (require('../utils/database').JSONDatabase)('parents.json');
    await parentsDB.init();
    
    const parent = await parentsDB.findOne({ user_id: req.user.id });
    
    if (!parent) {
      return res.status(404).json({ success: false, error: 'Profil parent non trouvé' });
    }

    res.json({ success: true, profile: parent });
  } catch (error) {
    console.error('❌ Erreur récupération profil parent:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// 🟢 PARENT - METTRE À JOUR LE PROFIL PARENT
router.put('/parent/profile', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ success: false, error: 'Réservé aux parents' });
    }

    const { telephone, adresse, commune, quartier } = req.body;

    const parentsDB = new (require('../utils/database').JSONDatabase)('parents.json');
    await parentsDB.init();
    
    let parent = await parentsDB.findOne({ user_id: req.user.id });
    
    if (!parent) {
      // Créer le profil parent s'il n'existe pas
      parent = await parentsDB.create({
        user_id: req.user.id,
        telephone: telephone || null,
        adresse: adresse || null,
        commune: commune || null,
        quartier: quartier || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } else {
      // Mettre à jour
      await parentsDB.update(parent.id, {
        telephone: telephone || null,
        adresse: adresse || null,
        commune: commune || null,
        quartier: quartier || null,
        updated_at: new Date().toISOString()
      });
      
      parent = await parentsDB.findById(parent.id);
    }

    console.log(`✅ Profil parent mis à jour pour ${req.user.id}`);
    
    res.json({ 
      success: true, 
      profile: parent,
      message: 'Profil mis à jour avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur mise à jour profil parent:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});