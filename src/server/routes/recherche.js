const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { JSONDatabase, usersDB } = require('../utils/database');

let precepteursDB, matieresDB, contratsDB, elevesDB, parentsDB;

async function initDBs() {
  precepteursDB = new JSONDatabase('precepteurs.json');
  matieresDB = new JSONDatabase('matieres.json');
  contratsDB = new JSONDatabase('contracts.json');
  elevesDB = new JSONDatabase('eleves.json');
  parentsDB = new JSONDatabase('parents.json');
  
  await Promise.all([
    precepteursDB.init(),
    matieresDB.init(),
    contratsDB.init(),
    elevesDB.init(),
    parentsDB.init()
  ]);
  
  // 🔍 LOG : Vérifier le contenu des fichiers au démarrage
  console.log('\n📂 ========== CONTENU DE precepteurs.json ==========');
  const allPrecepteurs = await precepteursDB.findAll();
  console.log(JSON.stringify(allPrecepteurs, null, 2));
  console.log(`📂 Total précepteurs: ${allPrecepteurs.length}`);
  
  console.log('\n📂 ========== CONTENU DE matieres.json ==========');
  const allMatieres = await matieresDB.findAll();
  console.log(JSON.stringify(allMatieres, null, 2));
  console.log(`📂 Total matières: ${allMatieres.length}`);
  
  console.log('\n📂 ========== CONTENU DE users.json ==========');
  const allUsers = await usersDB.findAll();
  console.log(allUsers.map(u => ({ 
    id: u.id, 
    email: u.email, 
    role: u.role, 
    username: u.username 
  })));
}

initDBs();

// Helper pour obtenir le parent_id
async function getParentId(userId) {
  const parent = await parentsDB.findOne({ user_id: userId });
  return parent?.id || null;
}

// Helper pour obtenir ou créer un parent
async function getOrCreateParent(userId) {
  let parent = await parentsDB.findOne({ user_id: userId });
  if (!parent) {
    parent = await parentsDB.create({
      user_id: userId,
      telephone: null,
      adresse: null
    });
    console.log('✅ Nouveau parent créé:', parent.id);
  }
  return parent;
}

// Helper pour rechercher une matière par nom (insensible à la casse)
async function findMatiereByName(nom) {
  const allMatieres = await matieresDB.findAll();
  const regex = new RegExp(nom, 'i');
  return allMatieres.find(m => regex.test(m.nom));
}

// =============================================
// RECHERCHE PRÉCEPTEURS
// =============================================
router.get('/precepteurs', authenticateToken, async (req, res) => {
  try {
    console.log('\n🔍 ========== DÉBUT RECHERCHE PRÉCEPTEURS ==========');
    
    const {
      matiere,
      commune,
      quartier,
      experienceMin,
      noteMin,
      disponible,
      tri = 'note',
      page = 1,
      limit = 10
    } = req.query;

    console.log('📥 Paramètres reçus:', JSON.stringify({ 
      matiere, commune, quartier, experienceMin, noteMin, disponible, tri, page, limit 
    }, null, 2));

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // ÉTAPE 1 : Récupérer TOUS les précepteurs
    console.log('\n📊 ÉTAPE 1 : Récupération de TOUS les précepteurs...');
    const allPrecepteurs = await precepteursDB.findAll();
    console.log(`  - Total dans la base: ${allPrecepteurs.length}`);
    
    allPrecepteurs.forEach(p => {
      console.log(`  - ID: ${p.id} | user_id: ${p.user_id} | statut: ${p.statut_verification} | disponible: ${p.disponible} | commune: ${p.commune || 'N/A'} | matieres: ${(p.precepteur_matieres || []).length}`);
    });

    // ÉTAPE 2 : Filtrer par statut_verification = 'verifie'
    console.log('\n📊 ÉTAPE 2 : Filtre statut_verification = "verifie"');
    let precepteurs = allPrecepteurs.filter(p => p.statut_verification === 'verifie');
    console.log(`  - Après filtre: ${precepteurs.length} précepteurs vérifiés`);
    
    if (precepteurs.length === 0) {
      console.log('  ⚠️ AUCUN précepteur vérifié ! Vérifiez les statuts dans precepteurs.json');
    }

    // ÉTAPE 3 : Filtre disponibilité
    if (disponible !== undefined) {
      const isDisponible = disponible === 'true';
      console.log(`\n📊 ÉTAPE 3 : Filtre disponibilité = ${isDisponible}`);
      const avant = precepteurs.length;
      precepteurs = precepteurs.filter(p => p.disponible === isDisponible);
      console.log(`  - ${avant} → ${precepteurs.length} précepteurs`);
    }

    // ÉTAPE 4 : Filtre expérience minimum
    if (experienceMin) {
      const minExp = parseInt(experienceMin);
      console.log(`\n📊 ÉTAPE 4 : Filtre expérience >= ${minExp}`);
      const avant = precepteurs.length;
      precepteurs = precepteurs.filter(p => (p.annees_experience || 0) >= minExp);
      console.log(`  - ${avant} → ${precepteurs.length} précepteurs`);
    }

    // ÉTAPE 5 : Filtre note minimum
    if (noteMin) {
      const minNote = parseFloat(noteMin);
      console.log(`\n📊 ÉTAPE 5 : Filtre note >= ${minNote}`);
      const avant = precepteurs.length;
      precepteurs = precepteurs.filter(p => (p.note_moyenne || 0) >= minNote);
      console.log(`  - ${avant} → ${precepteurs.length} précepteurs`);
    }

    // ÉTAPE 6 : Filtre commune
    if (commune) {
      const communeLower = commune.toLowerCase();
      console.log(`\n📊 ÉTAPE 6 : Filtre commune contenant "${communeLower}"`);
      const avant = precepteurs.length;
      precepteurs = precepteurs.filter(p => {
        const comm = (p.commune || '').toLowerCase();
        return comm.includes(communeLower);
      });
      console.log(`  - ${avant} → ${precepteurs.length} précepteurs`);
    }

    // ÉTAPE 7 : Filtre quartier
    if (quartier) {
      const quartierLower = quartier.toLowerCase();
      console.log(`\n📊 ÉTAPE 7 : Filtre quartier contenant "${quartierLower}"`);
      const avant = precepteurs.length;
      precepteurs = precepteurs.filter(p => {
        const quar = (p.quartier || '').toLowerCase();
        return quar.includes(quartierLower);
      });
      console.log(`  - ${avant} → ${precepteurs.length} précepteurs`);
    }

    // ÉTAPE 8 : Filtre matière
    if (matiere) {
      console.log(`\n📊 ÉTAPE 8 : Filtre matière = "${matiere}"`);
      
      const matiereObj = await findMatiereByName(matiere);
      console.log(`  - Matière trouvée:`, matiereObj ? `"${matiereObj.nom}" (ID: ${matiereObj.id})` : '❌ NON TROUVÉE');
      
      if (matiereObj) {
        const avant = precepteurs.length;
        precepteurs = precepteurs.filter(p => {
          const matieres = p.precepteur_matieres || [];
          const hasMatiere = matieres.some(pm => String(pm.matiere_id) === String(matiereObj.id));
          if (!hasMatiere) {
            console.log(`  - ❌ Précepteur ${p.id} n'a pas la matière ${matiereObj.id} (a: ${matieres.map(m => m.matiere_id).join(', ')})`);
          }
          return hasMatiere;
        });
        console.log(`  - ${avant} → ${precepteurs.length} précepteurs`);
      } else {
        console.log('  ⚠️ Matière non trouvée, retour vide');
        return res.json({ 
          success: true, 
          precepteurs: [], 
          total: 0, 
          totalPages: 0, 
          page: pageNum 
        });
      }
    }

    // ÉTAPE 9 : Tri
    console.log(`\n📊 ÉTAPE 9 : Tri par ${tri}`);
    switch (tri) {
      case 'experience':
        precepteurs.sort((a, b) => (b.annees_experience || 0) - (a.annees_experience || 0));
        break;
      case 'note':
      default:
        precepteurs.sort((a, b) => (b.note_moyenne || 0) - (a.note_moyenne || 0));
        break;
    }

    // ÉTAPE 10 : Pagination
    const total = precepteurs.length;
    const totalPages = Math.ceil(total / limitNum);
    const paginatedPrecepteurs = precepteurs.slice(offset, offset + limitNum);
    
    console.log(`\n📊 ÉTAPE 10 : Pagination`);
    console.log(`  - Total: ${total}, Page: ${pageNum}/${totalPages}, Affichés: ${paginatedPrecepteurs.length}`);

    // ÉTAPE 11 : Enrichissement avec les données utilisateur
    console.log(`\n📊 ÉTAPE 11 : Enrichissement...`);
    const enrichedPrecepteurs = await Promise.all(
      paginatedPrecepteurs.map(async (precepteur) => {
        const user = await usersDB.findById(precepteur.user_id);
        
        if (!user) {
          console.log(`  ⚠️ ATTENTION: Aucun utilisateur trouvé pour user_id=${precepteur.user_id} (précepteur ${precepteur.id})`);
        }

        const cleanUser = user ? {
          id: user.id,
          username: user.username,
          email: user.email,
          genre: user.genre,
          photo_profil: user.photo_profil
        } : null;

        const matieres = (precepteur.precepteur_matieres || []).map(pm => ({
          matiere_id: pm.matiere_id,
          matiere: pm.matiere || null
        }));

        const contrats = await contratsDB.findAll({ precepteur_id: precepteur.id });
        const stats = contrats.map(c => ({ id: c.id, statut: c.statut }));

        return {
          id: precepteur.id,
          user_id: precepteur.user_id,
          commune: precepteur.commune,
          quartier: precepteur.quartier,
          latitude: precepteur.latitude,
          longitude: precepteur.longitude,
          annees_experience: precepteur.annees_experience,
          note_moyenne: precepteur.note_moyenne,
          disponible: precepteur.disponible,
          diplome: precepteur.diplome,
          etablissement_origine: precepteur.etablissement_origine,
          statut_verification: precepteur.statut_verification,
          telephone: precepteur.telephone,
          user: cleanUser,
          matieres,
          stats
        };
      })
    );

    console.log(`\n✅ RÉSULTAT FINAL: ${enrichedPrecepteurs.length} précepteurs retournés`);
    console.log('==========================================\n');

    res.json({
      success: true,
      precepteurs: enrichedPrecepteurs,
      total,
      totalPages,
      page: pageNum
    });

  } catch (error) {
    console.error('❌ ERREUR recherche précepteurs:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la recherche',
      precepteurs: [],
      total: 0,
      totalPages: 0,
      page: 1
    });
  }
});

// =============================================
// RÉCUPÉRER LE PROFIL D'UN PRÉCEPTEUR
// =============================================
router.get('/precepteurs/:id', authenticateToken, async (req, res) => {
  try {
    const precepteurId = req.params.id;
    console.log('🔍 Chargement profil précepteur:', precepteurId);

    const precepteur = await precepteursDB.findById(precepteurId);
    if (!precepteur) {
      return res.status(404).json({ success: false, error: 'Précepteur non trouvé' });
    }

    const user = await usersDB.findById(precepteur.user_id);
    const cleanUser = user ? {
      id: user.id,
      username: user.username,
      email: user.email,
      genre: user.genre,
      photo_profil: user.photo_profil,
      telephone: user.telephone,
      created_at: user.created_at
    } : null;

    const matieres = (precepteur.precepteur_matieres || []).map(pm => ({
      matiere_id: pm.matiere_id,
      matiere: pm.matiere || null
    }));

    // Récupérer les évaluations
    let evaluations = [];
    try {
      const evaluationsDB = new JSONDatabase('evaluations.json');
      await evaluationsDB.init();
      evaluations = await evaluationsDB.findAll({ precepteur_id: precepteurId });
    } catch (e) {
      console.log('⚠️ Pas de fichier evaluations.json');
    }

    const enrichedEvaluations = await Promise.all(
      evaluations
        .sort((a, b) => new Date(b.date_evaluation || b.created_at).getTime() - new Date(a.date_evaluation || a.created_at).getTime())
        .map(async (evalItem) => {
          let matiere = null;
          if (evalItem.matiere_id) {
            matiere = await matieresDB.findById(evalItem.matiere_id);
          }
          return {
            ...evalItem,
            matiere: matiere ? { nom: matiere.nom, niveau: matiere.niveau } : null
          };
        })
    );

    res.json({
      success: true,
      precepteur: {
        ...precepteur,
        user: cleanUser,
        matieres,
        evaluations: enrichedEvaluations
      }
    });

  } catch (error) {
    console.error('❌ Erreur profil précepteur:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// =============================================
// STATISTIQUES D'UN PRÉCEPTEUR
// =============================================
router.get('/precepteurs/:id/stats', authenticateToken, async (req, res) => {
  try {
    const precepteurId = req.params.id;

    const contrats = await contratsDB.findAll({ precepteur_id: precepteurId });
    const contratIds = contrats.map(c => c.id);

    let sessions = [];
    try {
      const sessionsDB = new JSONDatabase('sessions.json');
      await sessionsDB.init();
      
      for (const contratId of contratIds) {
        const contratSessions = await sessionsDB.findAll({ contract_id: contratId });
        sessions.push(...contratSessions);
      }
    } catch (e) {
      console.log('⚠️ Pas de fichier sessions.json');
    }

    let totalEvaluations = 0;
    let moyenne = '0.0';
    
    try {
      const evaluationsDB = new JSONDatabase('precepteur_ratings.json');
      await evaluationsDB.init();
      const ratings = await evaluationsDB.findAll({ precepteur_id: precepteurId });
      
      const notes = ratings.map(r => r.note).filter(n => n !== null && n !== undefined);
      totalEvaluations = notes.length;
      moyenne = totalEvaluations > 0
        ? (notes.reduce((sum, n) => sum + n, 0) / totalEvaluations).toFixed(1)
        : '0.0';
    } catch (e) {
      console.log('⚠️ Pas de fichier precepteur_ratings.json');
    }

    res.json({ 
      success: true, 
      stats: {
        totalContrats: contrats.length,
        contratsActifs: contrats.filter(c => c.statut === 'actif').length,
        totalSessions: sessions.length,
        sessionsTerminees: sessions.filter(s => s.statut === 'termine').length,
        moyenneNotes: moyenne,
        totalEvaluations
      }
    });

  } catch (error) {
    console.error('❌ Erreur stats précepteur:', error);
    res.json({ 
      success: true, 
      stats: {
        totalContrats: 0, contratsActifs: 0, totalSessions: 0,
        sessionsTerminees: 0, moyenneNotes: '0.0', totalEvaluations: 0
      }
    });
  }
});

// =============================================
// RÉCUPÉRER LES MATIÈRES
// =============================================
router.get('/matieres', authenticateToken, async (req, res) => {
  try {
    const matieres = await matieresDB.findAll();
    matieres.sort((a, b) => a.nom.localeCompare(b.nom));
    console.log(`📚 ${matieres.length} matières retournées`);
    res.json({ success: true, matieres });
  } catch (error) {
    console.error('❌ Erreur matières:', error);
    res.json({ success: true, matieres: [] });
  }
});

// =============================================
// RÉCUPÉRER LES COMMUNES
// =============================================
router.get('/communes', authenticateToken, async (req, res) => {
  try {
    const precepteurs = await precepteursDB.findAll({ statut_verification: 'verifie' });
    const communes = [...new Set(precepteurs.map(p => p.commune).filter(Boolean))].sort();
    console.log(`🏙️ ${communes.length} communes retournées:`, communes);
    res.json({ success: true, communes });
  } catch (error) {
    console.error('❌ Erreur communes:', error);
    res.json({ success: true, communes: [] });
  }
});

// =============================================
// RÉCUPÉRER LES QUARTIERS
// =============================================
router.get('/quartiers', authenticateToken, async (req, res) => {
  try {
    const precepteurs = await precepteursDB.findAll({ statut_verification: 'verifie' });
    const quartiers = [...new Set(precepteurs.map(p => p.quartier).filter(Boolean))].sort();
    console.log(`📍 ${quartiers.length} quartiers retournés:`, quartiers);
    res.json({ success: true, quartiers });
  } catch (error) {
    console.error('❌ Erreur quartiers:', error);
    res.json({ success: true, quartiers: [] });
  }
});

// =============================================
// DEMANDER UN CONTRAT
// =============================================
router.post('/contrats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      precepteurId, eleveId, matiereId, dateDebut, dateFin,
      heureDebutPref, heureFinPref, joursPref, typeContrat,
      frequence, tarifHoraire, notes
    } = req.body;

    console.log('📝 Demande de contrat:', { precepteurId, eleveId, matiereId });

    if (!precepteurId || !eleveId || !matiereId || !dateDebut || !dateFin || 
        !heureDebutPref || !heureFinPref || !joursPref || !typeContrat || !frequence) {
      return res.status(400).json({ 
        success: false, 
        error: 'Tous les champs obligatoires doivent être remplis' 
      });
    }

    const parent = await getOrCreateParent(userId);

    // Vérifier l'élève
    const tousLesEleves = await elevesDB.findAll({ parent_id: parent.id });
    const eleve = tousLesEleves.find(e => String(e.id) === String(eleveId));
    
    if (!eleve) {
      console.log('❌ Élève non trouvé. ID recherché:', eleveId, 'Disponibles:', tousLesEleves.map(e => e.id));
      return res.status(404).json({ success: false, error: 'Élève non trouvé' });
    }

    // Vérifier le précepteur
    const precepteur = await precepteursDB.findById(precepteurId);
    if (!precepteur) {
      return res.status(404).json({ success: false, error: 'Précepteur non trouvé' });
    }

    if (!precepteur.disponible) {
      return res.status(400).json({ success: false, error: 'Précepteur indisponible' });
    }

    // Vérifier les doublons
    const tousContrats = await contratsDB.findAll({
      parent_id: parent.id,
      precepteur_id: precepteurId,
      eleve_id: String(eleveId),
      matiere_id: String(matiereId)
    });

    const existeActif = tousContrats.some(c => 
      c.statut === 'en_attente' || c.statut === 'actif'
    );

    if (existeActif) {
      return res.status(400).json({ success: false, error: 'Contrat déjà existant' });
    }

    const contrat = await contratsDB.create({
      parent_id: parent.id,
      precepteur_id: precepteurId,
      eleve_id: String(eleveId),
      matiere_id: String(matiereId),
      date_debut: dateDebut,
      date_fin: dateFin,
      heure_debut_pref: heureDebutPref,
      heure_fin_pref: heureFinPref,
      jours_pref: joursPref,
      type_contrat: typeContrat,
      frequence,
      tarif_horaire: tarifHoraire || null,
      notes: notes || null,
      statut: 'en_attente'
    });

    console.log('✅ Contrat créé:', contrat.id);

    res.status(201).json({
      success: true,
      contract: contrat,
      message: 'Proposition envoyée avec succès !'
    });

  } catch (error) {
    console.error('❌ Erreur création contrat:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la création du contrat' 
    });
  }
});

module.exports = router;