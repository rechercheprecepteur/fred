// const express = require('express');
// const router = express.Router();
// const { authenticateToken } = require('../middleware/auth');
// const { JSONDatabase } = require('../utils/database');

// let servicesDB, parentsDB, elevesDB;

// async function initDBs() {
//   servicesDB = new JSONDatabase('parent-services.json');
//   parentsDB = new JSONDatabase('parents.json');
//   elevesDB = new JSONDatabase('eleves.json');
//   await Promise.all([
//     servicesDB.init(), 
//     parentsDB.init(), 
//     elevesDB.init()
//   ]);
// }

// initDBs();

// // Helper pour obtenir le parent_id depuis le user_id
// async function getParentId(userId) {
//   console.log('🔍 getParentId - recherche pour userId:', userId);
  
//   const parent = await parentsDB.findOne({ user_id: userId });
  
//   console.log('  - Parent trouvé:', parent ? { id: parent.id, type: typeof parent.id } : 'NON');
  
//   return parent?.id || null;
// }

// // 🟢 CRÉER UN SERVICE (VERSION CORRIGÉE)
// router.post('/', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const {
//       eleve_id,
//       titre,
//       description,
//       matiere_preferee,
//       niveau_eleve,
//       frequence_souhaitee,
//       jours_preferences,
//       heures_preferences,
//       budget_horaire,
//       lieu_preference
//     } = req.body;

//     // Validation
//     if (!eleve_id || !titre || !description || !niveau_eleve || !frequence_souhaitee || !lieu_preference) {
//       return res.status(400).json({
//         success: false,
//         error: 'Les champs eleve_id, titre, description, niveau_eleve, frequence_souhaitee et lieu_preference sont requis'
//       });
//     }

//     const parentId = await getParentId(userId);
//     if (!parentId) {
//       return res.status(404).json({ success: false, error: 'Parent non trouvé' });
//     }

//     // 🔍 LOGS DE DEBUG
//     console.log('🔍 DEBUG parent-service:');
//     console.log('  - userId:', userId);
//     console.log('  - parentId:', parentId, '(type:', typeof parentId, ')');
//     console.log('  - eleve_id reçu:', eleve_id, '(type:', typeof eleve_id, ')');
    
//     // 🔧 CORRECTION : Récupérer TOUS les élèves du parent et filtrer manuellement
//     const tousLesEleves = await elevesDB.findAll({ parent_id: parentId });
    
//     console.log('  - Élèves trouvés pour ce parent:', tousLesEleves.length);
//     tousLesEleves.forEach(e => {
//       console.log(`    - ID: "${e.id}" (type: ${typeof e.id}) | ${e.prenom} ${e.nom}`);
//     });
    
//     // 🔧 CORRECTION : Comparer en convertissant tout en string
//     const eleve = tousLesEleves.find(e => String(e.id) === String(eleve_id));
    
//     if (!eleve) {
//       console.log('  - ❌ Élève non trouvé !');
//       console.log('  - ID recherché:', String(eleve_id));
//       console.log('  - IDs disponibles:', tousLesEleves.map(e => e.id));
      
//       return res.status(404).json({ 
//         success: false, 
//         error: 'Enfant non trouvé ou non autorisé' 
//       });
//     }

//     console.log('  - ✅ Élève trouvé:', eleve.prenom, eleve.nom);

//     // Créer le service
//     const service = await servicesDB.create({
//       parent_id: parentId,
//       eleve_id: String(eleve_id),  // Toujours en string
//       titre: titre.trim(),
//       description: description.trim(),
//       matiere_preferee: matiere_preferee?.trim() || null,
//       niveau_eleve,
//       frequence_souhaitee,
//       jours_preferences: jours_preferences?.trim() || null,
//       heures_preferences: heures_preferences?.trim() || null,
//       budget_horaire: budget_horaire || null,
//       lieu_preference,
//       statut: 'actif',
//       nombre_vues: 0,
//       nombre_candidatures: 0,
//       date_expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
//     });

//     console.log('✅ Service créé:', service.id, '-', titre);

//     const enrichedService = {
//       ...service,
//       eleve: {
//         nom: eleve.nom,
//         prenom: eleve.prenom,
//         niveau: eleve.niveau
//       }
//     };

//     res.status(201).json({
//       success: true,
//       service: enrichedService,
//       message: 'Service créé avec succès'
//     });

//   } catch (error) {
//     console.error('❌ Erreur création service:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Erreur lors de la création du service'
//     });
//   }
// });

// // 🟢 RÉCUPÉRER LES SERVICES DU PARENT
// router.get('/', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const parentId = await getParentId(userId);
//     if (!parentId) {
//       return res.json({ success: true, services: [] });
//     }

//     let services = await servicesDB.findAll({ parent_id: parentId });

//     // Enrichir avec les infos des élèves
//     const enrichedServices = await Promise.all(
//       services.map(async (service) => {
//         const eleve = await elevesDB.findById(service.eleve_id);
//         return {
//           ...service,
//           eleve: eleve ? {
//             nom: eleve.nom,
//             prenom: eleve.prenom,
//             niveau: eleve.niveau
//           } : null
//         };
//       })
//     );

//     // Trier par date de création (plus récent d'abord)
//     enrichedServices.sort((a, b) => 
//       new Date(b.date_creation || b.created_at).getTime() - 
//       new Date(a.date_creation || a.created_at).getTime()
//     );

//     res.json({ success: true, services: enrichedServices });

//   } catch (error) {
//     console.error('❌ Erreur récupération services:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Erreur lors de la récupération des services'
//     });
//   }
// });

// // 🟢 SUPPRIMER UN SERVICE
// router.delete('/:id', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const serviceId = req.params.id;

//     const parentId = await getParentId(userId);
//     if (!parentId) {
//       return res.status(404).json({ success: false, error: 'Parent non trouvé' });
//     }

//     // Vérifier que le service appartient au parent
//     const service = await servicesDB.findOne({ 
//       id: serviceId, 
//       parent_id: parentId 
//     });

//     if (!service) {
//       return res.status(404).json({ 
//         success: false, 
//         error: 'Service non trouvé ou non autorisé' 
//       });
//     }

//     // Supprimer le service
//     await servicesDB.delete(serviceId);

//     console.log('✅ Service supprimé:', serviceId);

//     res.json({ 
//       success: true, 
//       message: 'Service supprimé avec succès' 
//     });

//   } catch (error) {
//     console.error('❌ Erreur suppression service:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Erreur lors de la suppression du service'
//     });
//   }
// });

// // 🟢 METTRE À JOUR LE STATUT D'UN SERVICE
// router.put('/:id/status', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const serviceId = req.params.id;
//     const { statut } = req.body;

//     const validStatuses = ['actif', 'pourvu', 'expire', 'annule', 'en_cours'];
//     if (!validStatuses.includes(statut)) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Statut invalide' 
//       });
//     }

//     const parentId = await getParentId(userId);
//     if (!parentId) {
//       return res.status(404).json({ success: false, error: 'Parent non trouvé' });
//     }

//     const service = await servicesDB.findOne({ 
//       id: serviceId, 
//       parent_id: parentId 
//     });

//     if (!service) {
//       return res.status(404).json({ 
//         success: false, 
//         error: 'Service non trouvé ou non autorisé' 
//       });
//     }

//     await servicesDB.update(serviceId, { statut });

//     res.json({ success: true, message: `Service ${statut}` });

//   } catch (error) {
//     console.error('❌ Erreur mise à jour statut service:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Erreur lors de la mise à jour du statut'
//     });
//   }
// });

// module.exports = router;


// server/routes/parent-service.js
const express = require('express');
const router = express.Router();
const { JSONDatabase } = require('../utils/database');
const { authenticateToken } = require('../middleware/auth');
// 🟢 GET /api/parent-services/all - Récupérer tous les services parents
router.get('/all', async (req, res) => {
  try {
    console.log('📡 GET /parent-services/all');
    
    // 1. Lire les services
    const parentServicesDB = new JSONDatabase('parent_services.json');
    await parentServicesDB.init();
    
    const allServices = await parentServicesDB.findAll();
    console.log(`📊 ${allServices.length} services trouvés`);
    
    // 2. Lire les élèves
    const elevesDB = new JSONDatabase('eleves.json');
    await elevesDB.init();
    
    const allEleves = await elevesDB.findAll();
    console.log(`📊 ${allEleves.length} élèves trouvés`);
    
    // 3. Créer un map des élèves
    const elevesMap = {};
    allEleves.forEach(eleve => {
      elevesMap[String(eleve.id)] = eleve;
    });
    
    // 4. Enrichir les services
    const result = allServices.map(service => {
      const eleve = elevesMap[String(service.eleve_id)] || null;
      
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
    
    console.log(`✅ ${result.length} services retournés`);
    res.json({ success: true, services: result });
    
  } catch (error) {
    console.error('❌ Erreur GET /parent-services/all:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur serveur' 
    });
  }
});

// 🟢 GET /api/parent-services - Récupérer les services du PARENT CONNECTÉ
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('📡 GET /parent-services - Parent connecté:', req.user?.id);
    
    // 1. Trouver le parent connecté
    const parentsDB = new JSONDatabase('parents.json');
    await parentsDB.init();
    
    const parent = await parentsDB.findOne({ user_id: req.user.id });
    
    if (!parent) {
      console.log('❌ Parent non trouvé pour user_id:', req.user.id);
      return res.json({ success: true, services: [] });
    }
    
    console.log('👤 Parent trouvé:', parent.id);
    
    // 2. Récupérer les services de CE parent uniquement
    const parentServicesDB = new JSONDatabase('parent_services.json');
    await parentServicesDB.init();
    
    const services = await parentServicesDB.findAll({ 
      parent_id: parent.id  // ✅ FILTRE ICI
    });
    
    console.log(`📊 ${services.length} services trouvés pour ce parent`);
    
    // 3. Enrichir avec les infos des élèves
    const elevesDB = new JSONDatabase('eleves.json');
    await elevesDB.init();
    
    const elevesMap = {};
    const allEleves = await elevesDB.findAll();
    allEleves.forEach(eleve => {
      elevesMap[String(eleve.id)] = eleve;
    });
    
    // 4. Formater
    const result = services.map(service => {
      const eleve = elevesMap[String(service.eleve_id)] || null;
      
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
        date_creation: service.date_creation || service.created_at || new Date().toISOString(),
        date_expiration: service.date_expiration || null,
        eleve: eleve ? {
          id: eleve.id,
          nom: eleve.nom || '',
          prenom: eleve.prenom || '',
          niveau: eleve.niveau || ''
        } : null
      };
    });
    
    console.log(`✅ ${result.length} services formatés`);
    
    res.json({ 
      success: true, 
      services: result 
    });
    
  } catch (error) {
    console.error('❌ Erreur GET /parent-services:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// 🟢 POST /api/parent-services - Créer un service
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('📡 POST /parent-services');
    console.log('👤 User ID:', req.user?.id);
    console.log('📦 Body reçu:', req.body);
    
    // 1. Trouver le parent connecté
    const parentsDB = new JSONDatabase('parents.json');
    await parentsDB.init();
    
    const parent = await parentsDB.findOne({ user_id: req.user.id });
    
    if (!parent) {
      console.log('❌ Parent non trouvé pour user_id:', req.user.id);
      return res.status(404).json({ 
        success: false, 
        error: 'Profil parent non trouvé' 
      });
    }
    
    console.log('✅ Parent trouvé:', parent.id);
    
    // 2. Créer le service AVEC parent_id et statut
    const parentServicesDB = new JSONDatabase('parent_services.json');
    await parentServicesDB.init();
    
    const serviceData = {
      parent_id: parent.id,                    // ✅ AJOUTÉ
      eleve_id: req.body.eleve_id,
      titre: req.body.titre,
      description: req.body.description || '',
      matiere_preferee: req.body.matiere_preferee || '',
      niveau_eleve: req.body.niveau_eleve,
      frequence_souhaitee: req.body.frequence_souhaitee,
      jours_preferences: req.body.jours_preferences || '',
      heures_preferences: req.body.heures_preferences || '',
      budget_horaire: req.body.budget_horaire || null,  // ✅ AJOUTÉ
      lieu_preference: req.body.lieu_preference,
      statut: 'en_attente',                    // ✅ AJOUTÉ
      nombre_vues: 0,                          // ✅ AJOUTÉ
      nombre_candidatures: 0,                  // ✅ AJOUTÉ
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      date_expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // ✅ AJOUTÉ (+30 jours)
    };
    
    console.log('💾 Données à sauvegarder:', serviceData);
    
    const service = await parentServicesDB.create(serviceData);
    
    console.log('✅ Service créé avec ID:', service.id);
    
    res.status(201).json({ 
      success: true, 
      service: service,
      message: 'Service créé avec succès'
    });
    
  } catch (error) {
    console.error('❌ Erreur POST /parent-services:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur serveur' 
    });
  }
});


// 🟢 DELETE /api/parent-services/:id - Supprimer un service
router.delete('/:id', async (req, res) => {
  try {
    const parentServicesDB = new JSONDatabase('parent_services.json');
    await parentServicesDB.init();
    
    await parentServicesDB.delete(req.params.id);
    
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur DELETE /parent-services/:id:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;