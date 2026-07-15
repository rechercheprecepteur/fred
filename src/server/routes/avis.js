const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { usersDB, JSONDatabase } = require('../utils/database');

let precepteursDB, ratingsDB, parentsDB, contratsDB, matieresDB, elevesDB;

async function initDBs() {
  precepteursDB = new JSONDatabase('precepteurs.json');
  ratingsDB = new JSONDatabase('precepteur_ratings.json');
  parentsDB = new JSONDatabase('parents.json');
  contratsDB = new JSONDatabase('contracts.json');
  matieresDB = new JSONDatabase('matieres.json');
  elevesDB = new JSONDatabase('eleves.json');
  
  await Promise.all([
    precepteursDB.init(),
    ratingsDB.init(),
    parentsDB.init(),
    contratsDB.init(),
    matieresDB.init(),
    elevesDB.init()
  ]);
}

initDBs();

// 🟢 RÉCUPÉRER LES AVIS D'UN PRÉCEPTEUR
router.get('/precepteur/:precepteurId', authenticateToken, async (req, res) => {
  try {
    const { precepteurId } = req.params;

    console.log('🔍 Chargement des avis pour precepteurId:', precepteurId);

    // Vérifier que le précepteur existe
    const precepteur = await precepteursDB.findById(precepteurId);
    if (!precepteur) {
      return res.status(404).json({ 
        success: false, 
        error: 'Précepteur non trouvé' 
      });
    }

    // Récupérer tous les ratings pour ce précepteur
    const ratings = await ratingsDB.findAll({ 
      precepteur_id: precepteurId 
    });

    console.log(`✅ ${ratings.length} ratings trouvés`);

    if (ratings.length === 0) {
      return res.json({ 
        success: true, 
        ratings: [],
        stats: {
          moyenne: 0,
          total: 0,
          repartition: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        }
      });
    }

    // Récupérer les IDs uniques
    const parentIds = [...new Set(ratings.map(r => r.parent_id))];
    const contractIds = [...new Set(ratings.map(r => r.contract_id))];

    // Récupérer les parents en parallèle
    const parentsData = await Promise.all(
      parentIds.map(async (parentId) => {
        const parent = await parentsDB.findById(parentId);
        if (!parent) return null;
        
        const user = await usersDB.findById(parent.user_id);
        const cleanUser = user ? {
          username: user.username,
          photo_profil: user.photo_profil
        } : null;

        return {
          id: parent.id,
          user: cleanUser
        };
      })
    );

    // Récupérer les contrats en parallèle
    const contractsData = await Promise.all(
      contractIds.map(async (contractId) => {
        const contract = await contratsDB.findById(contractId);
        if (!contract) return null;

        const matiere = await matieresDB.findById(contract.matiere_id);
        const eleve = await elevesDB.findById(contract.eleve_id);

        return {
          id: contract.id,
          matiere: matiere ? {
            nom: matiere.nom,
            niveau: matiere.niveau
          } : null,
          eleve: eleve ? {
            prenom: eleve.prenom,
            nom: eleve.nom,
            niveau: eleve.niveau
          } : null
        };
      })
    );

    // Créer des maps pour un accès rapide
    const parentsMap = new Map();
    parentsData.forEach(p => {
      if (p) parentsMap.set(p.id, p);
    });

    const contractsMap = new Map();
    contractsData.forEach(c => {
      if (c) contractsMap.set(c.id, c);
    });

    // Assembler les ratings avec leurs données liées
    const enrichedRatings = ratings
      .map(rating => ({
        id: rating.id,
        contract_id: rating.contract_id,
        precepteur_id: rating.precepteur_id,
        parent_id: rating.parent_id,
        note: rating.note,
        commentaire: rating.commentaire || null,
        created_at: rating.created_at,
        updated_at: rating.updated_at,
        parent: parentsMap.get(rating.parent_id) || null,
        contract: contractsMap.get(rating.contract_id) || null
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Calculer les statistiques
    const total = enrichedRatings.length;
    const moyenne = total > 0
      ? enrichedRatings.reduce((sum, r) => sum + r.note, 0) / total
      : 0;

    const repartition = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    enrichedRatings.forEach(r => {
      if (r.note >= 1 && r.note <= 5) {
        repartition[r.note]++;
      }
    });

    const stats = {
      moyenne: Math.round(moyenne * 10) / 10,
      total,
      repartition
    };

    console.log('📊 Stats calculées:', stats);

    res.json({
      success: true,
      ratings: enrichedRatings,
      stats
    });

  } catch (error) {
    console.error('❌ Erreur chargement avis:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors du chargement des avis',
      ratings: [],
      stats: {
        moyenne: 0,
        total: 0,
        repartition: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    });
  }
});

// 🟢 AJOUTER UN AVIS (optionnel - si tu veux permettre d'ajouter des avis)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { precepteur_id, contract_id, note, commentaire } = req.body;

    // Validation
    if (!precepteur_id || !contract_id || !note) {
      return res.status(400).json({ 
        success: false, 
        error: 'precepteur_id, contract_id et note sont requis' 
      });
    }

    if (note < 1 || note > 5) {
      return res.status(400).json({ 
        success: false, 
        error: 'La note doit être entre 1 et 5' 
      });
    }

    // Récupérer le parent
    const parent = await parentsDB.findOne({ user_id: userId });
    if (!parent) {
      return res.status(404).json({ success: false, error: 'Parent non trouvé' });
    }

    // Vérifier que le contrat appartient bien au parent
    const contract = await contratsDB.findOne({
      id: contract_id,
      parent_id: parent.id,
      precepteur_id: precepteur_id
    });

    if (!contract) {
      return res.status(404).json({ 
        success: false, 
        error: 'Contrat non trouvé ou non autorisé' 
      });
    }

    // Vérifier qu'il n'y a pas déjà un avis pour ce contrat
    const existingRating = await ratingsDB.findOne({
      contract_id: contract_id,
      parent_id: parent.id
    });

    if (existingRating) {
      // Mettre à jour l'avis existant
      await ratingsDB.update(existingRating.id, {
        note,
        commentaire: commentaire || null,
        updated_at: new Date().toISOString()
      });

      console.log('✅ Avis mis à jour:', existingRating.id);
    } else {
      // Créer un nouvel avis
      await ratingsDB.create({
        precepteur_id,
        contract_id,
        parent_id: parent.id,
        note,
        commentaire: commentaire || null
      });

      console.log('✅ Nouvel avis créé');
    }

    // Recalculer la note moyenne du précepteur
    const allRatings = await ratingsDB.findAll({ precepteur_id });
    const totalNotes = allRatings.length;
    const moyenne = totalNotes > 0
      ? allRatings.reduce((sum, r) => sum + r.note, 0) / totalNotes
      : 0;

    await precepteursDB.update(precepteur_id, {
      note_moyenne: Math.round(moyenne * 10) / 10
    });

    res.json({ 
      success: true, 
      message: 'Avis enregistré avec succès' 
    });

  } catch (error) {
    console.error('❌ Erreur ajout avis:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de l\'enregistrement de l\'avis' 
    });
  }
});

module.exports = router;