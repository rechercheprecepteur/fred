const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { usersDB } = require('../utils/database');
const { JSONDatabase } = require('../utils/database');

// Initialiser les DB
let elevesDB, parentsDB;

async function initDBs() {
  elevesDB = new JSONDatabase('eleves.json');
  parentsDB = new JSONDatabase('parents.json');
  await Promise.all([elevesDB.init(), parentsDB.init()]);
}

// Initialiser au démarrage
initDBs();

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

// Helper pour obtenir le parent_id depuis le user_id
async function getParentId(userId) {
  const parent = await parentsDB.findOne({ user_id: userId });
  return parent?.id || null;
}

// 🟢 AJOUTER UN ENFANT
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { nom, postnom, prenom, genre, date_naissance, niveau, ecole } = req.body;

    // Validation
    if (!nom || !prenom || !genre || !niveau) {
      return res.status(400).json({ 
        success: false, 
        error: 'Les champs nom, prénom, genre et niveau sont requis' 
      });
    }

    if (!['7ème', '8ème'].includes(niveau)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Niveau invalide. Uniquement 7ème et 8ème année sont acceptés.' 
      });
    }

    // Obtenir ou créer le parent
    const parent = await getOrCreateParent(userId);

    // Vérifier les doublons (même nom, prénom, date_naissance pour ce parent)
    const existingEleve = await elevesDB.findOne({
      parent_id: parent.id,
      nom: nom.trim(),
      prenom: prenom.trim(),
      date_naissance: date_naissance || null
    });

    if (existingEleve) {
      return res.status(400).json({
        success: false,
        error: 'Cet enfant existe déjà dans votre liste'
      });
    }

    // Créer l'élève
    const eleve = await elevesDB.create({
      parent_id: parent.id,
      nom: nom.trim(),
      postnom: postnom?.trim() || null,
      prenom: prenom.trim(),
      genre,
      date_naissance: date_naissance || null,
      niveau,
      ecole: ecole?.trim() || null
    });

    console.log('✅ Élève créé:', eleve.id, '-', prenom, nom);

    res.status(201).json({
      success: true,
      eleve,
      message: 'Enfant ajouté avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur ajout élève:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de l\'ajout de l\'enfant' 
    });
  }
});

// 🟢 RÉCUPÉRER LES ENFANTS DU PARENT
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const parent = await parentsDB.findOne({ user_id: userId });
    if (!parent) {
      return res.json({ success: true, eleves: [] });
    }

    const eleves = await elevesDB.findAll({ parent_id: parent.id });
    
    // Trier par niveau puis par nom
    eleves.sort((a, b) => {
      if (a.niveau !== b.niveau) return a.niveau.localeCompare(b.niveau);
      return a.nom.localeCompare(b.nom);
    });

    res.json({ success: true, eleves });

  } catch (error) {
    console.error('❌ Erreur récupération élèves:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la récupération des enfants' 
    });
  }
});

// 🟢 SUPPRIMER UN ENFANT
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const eleveId = req.params.id; // string

    const parent = await parentsDB.findOne({ user_id: userId });
    if (!parent) {
      return res.status(404).json({ success: false, error: 'Parent non trouvé' });
    }

    // Vérifier que l'élève appartient au parent
    const eleve = await elevesDB.findOne({ 
      id: eleveId, 
      parent_id: parent.id 
    });
    
    if (!eleve) {
      return res.status(404).json({ 
        success: false, 
        error: 'Enfant non trouvé ou non autorisé' 
      });
    }

    // Supprimer les contrats liés à cet élève
    const contratsDB = new JSONDatabase('contracts.json');
    await contratsDB.init();
    
    const contrats = await contratsDB.findAll({ eleve_id: eleveId });
    
    if (contrats.length > 0) {
      // Supprimer les sessions liées aux contrats
      const sessionsDB = new JSONDatabase('sessions.json');
      await sessionsDB.init();
      
      for (const contrat of contrats) {
        const sessions = await sessionsDB.findAll({ contract_id: contrat.id });
        for (const session of sessions) {
          await sessionsDB.delete(session.id);
        }
        await contratsDB.delete(contrat.id);
      }
    }

    // Supprimer les services liés à cet élève
    const servicesDB = new JSONDatabase('parent-services.json');
    await servicesDB.init();
    
    const services = await servicesDB.findAll({ eleve_id: eleveId });
    for (const service of services) {
      await servicesDB.delete(service.id);
    }

    // Supprimer l'élève
    await elevesDB.delete(eleveId);

    console.log('✅ Élève supprimé:', eleveId, '-', eleve.prenom, eleve.nom);

    res.json({ 
      success: true, 
      message: 'Enfant supprimé avec succès' 
    });

  } catch (error) {
    console.error('❌ Erreur suppression élève:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la suppression' 
    });
  }
});

module.exports = router;