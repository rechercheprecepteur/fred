// routes/services.js (ou dans routes/auth.js)
// 🟢 RÉCUPÉRER TOUS LES SERVICES PUBLICS (avec infos précepteur)
router.get('/services', async (req, res) => {
  try {
    const servicesDB = await getServicesDB();
    let services = await servicesDB.findAll({ est_actif: true });
    
    // Enrichir avec les infos des précepteurs
    const enrichedServices = await Promise.all(services.map(async (service) => {
      const precepteur = await precepteursDB.findById(service.precepteur_id);
      
      if (!precepteur) return null;
      
      // Infos utilisateur
      const user = await usersDB.findById(precepteur.user_id);
      const { password, verification_code, verification_code_expires, reset_token, reset_token_expires, ...cleanUser } = user || {};
      
      // Matières du précepteur
      let matieres = [];
      if (precepteur.precepteur_matieres && precepteur.precepteur_matieres.length > 0) {
        const matieresDB = new (require('../utils/database').JSONDatabase)('matieres.json');
        await matieresDB.init();
        
        matieres = await Promise.all(
          precepteur.precepteur_matieres.map(async (pm) => {
            const matiere = await matieresDB.findById(pm.matiere_id);
            return {
              matiere_id: pm.matiere_id,
              matiere: matiere
            };
          })
        );
      }
      
      return {
        ...service,
        precepteur: {
          ...precepteur,
          user: cleanUser,
          precepteur_matieres: matieres
        }
      };
    }));
    
    // Filtrer les nulls
    const validServices = enrichedServices.filter(Boolean);
    
    // Support des filtres
    let filteredServices = validServices;
    
    // Filtre par type
    if (req.query.type_service) {
      filteredServices = filteredServices.filter(s => s.type_service === req.query.type_service);
    }
    
    // Filtre par modalité
    if (req.query.modalite) {
      filteredServices = filteredServices.filter(s => s.modalite === req.query.modalite);
    }
    
    // Filtre par commune
    if (req.query.commune) {
      filteredServices = filteredServices.filter(s => 
        s.precepteur.commune?.toLowerCase().includes(req.query.commune.toLowerCase())
      );
    }
    
    // Tri
    const sort = req.query.sort || 'recent';
    switch (sort) {
      case 'prix_croissant':
        filteredServices.sort((a, b) => (a.tarif_horaire || 0) - (b.tarif_horaire || 0));
        break;
      case 'prix_decroissant':
        filteredServices.sort((a, b) => (b.tarif_horaire || 0) - (a.tarif_horaire || 0));
        break;
      case 'note':
        filteredServices.sort((a, b) => (b.precepteur.note_moyenne || 0) - (a.precepteur.note_moyenne || 0));
        break;
      default:
        filteredServices.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    
    res.json({ 
      success: true, 
      services: filteredServices,
      total: filteredServices.length
    });
    
  } catch (error) {
    console.error('❌ Erreur récupération services:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});