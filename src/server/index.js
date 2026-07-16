
// //server/index.js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const path = require('path');
// const fs = require('fs');
// const config = require('./config');
// const authRoutes = require('./routes/auth');
// const { usersDB, precepteursDB } = require('./utils/database');
// // Ajouter ces lignes dans ton fichier serveur principal
// const elevesRoutes = require('./routes/eleves');
// const rechercheRoutes = require('./routes/recherche');
// const avisRoutes = require('./routes/avis');
// const parentServiceRoutes = require('./routes/parent-service');
// const app = express();


// // ✅ Créer les dossiers nécessaires
// const dirs = [
//   config.dataPath,
//   config.uploadPath,
//   path.join(config.uploadPath, 'profils')
// ];

// dirs.forEach(dir => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// });

// // ✅ Middleware - ORDRE IMPORTANT
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true
// }));

// // ✅ Augmenter la limite pour les uploads
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// app.use(cookieParser());

// // ✅ Servir les fichiers statiques
// app.use('/uploads', express.static(config.uploadPath));

// // ✅ Routes API
// app.use('/api/auth', authRoutes);
// app.use('/api/avis', avisRoutes);
// app.use('/api/recherche', rechercheRoutes);
// // ✅ Route de test (sans authentification)
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'ok', timestamp: new Date().toISOString() });
// });
// // server/index.js
// app.use('/api/parent-services', parentServiceRoutes);
// // ✅ Route de test AVEC authentification
// app.get('/api/auth/test-token', require('./middleware/auth').authenticateToken, (req, res) => {
//   res.json({ success: true, message: 'Token valide!', user: req.user.username });
// });
// app.use('/api/eleves', elevesRoutes);
// app.use('/api/parent-services', parentServiceRoutes);
// // ✅ Démarrer le serveur
// const initDatabases = async () => {
//   await usersDB.init();
//   await precepteursDB.init();
  
//   const adminExists = await usersDB.findOne({ role: 'admin' });
//   if (!adminExists) {
//     const bcrypt = require('bcryptjs');
//     const hashedPassword = await bcrypt.hash('admin123', 10);
//     await usersDB.create({
//       email: 'admin@excellence.com',
//       password: hashedPassword,
//       username: 'Admin',
//       role: 'admin',
//       genre: 'homme',
//       email_verified: true,
//       photo_profil: null
//     });
//     console.log('✅ Compte admin créé: admin@excellence.com / admin123');
//   }
// };

// const PORT = config.port;
// initDatabases().then(() => {
//   app.listen(PORT, () => {
//     console.log(`🚀 Serveur Express démarré sur http://localhost:${PORT}`);
//     console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
//     console.log(`💾 Base de données: ${config.dataPath}`);
//   });
// }).catch(console.error);
// // Dans server.js, après la ligne app.use('/uploads', express.static(config.uploadPath));

// // ✅ Servir les documents avec le bon chemin
// app.use('/uploads/documents', express.static(path.join(config.uploadPath, 'documents'), {
//   maxAge: '1d',
//   setHeaders: (res, filePath) => {
//     // Permettre l'accès aux documents depuis le frontend
//     res.set('Cross-Origin-Resource-Policy', 'cross-origin');
//     res.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    
//     // Forcer le téléchargement pour certains types
//     if (filePath.endsWith('.pdf')) {
//       res.set('Content-Type', 'application/pdf');
//     }
//   }
// }));
// module.exports = app;

// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const authRoutes = require('./routes/auth');
const { usersDB, precepteursDB } = require('./utils/database');
// Ajouter ces lignes dans ton fichier serveur principal
const elevesRoutes = require('./routes/eleves');
const rechercheRoutes = require('./routes/recherche');
const avisRoutes = require('./routes/avis');
const parentServiceRoutes = require('./routes/parent-service');
// ✅ AJOUTER CETTE LIGNE
const sessionsRoutes = require('./routes/sessions');
const app = express();


// ✅ Créer les dossiers nécessaires
const dirs = [
  config.dataPath,
  config.uploadPath,
  path.join(config.uploadPath, 'profils'),
  // ✅ AJOUTER le dossier sessions
  path.join(config.uploadPath, 'sessions')
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ✅ Middleware - ORDRE IMPORTANT
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// ✅ Augmenter la limite pour les uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// ✅ Servir les fichiers statiques
app.use('/uploads', express.static(config.uploadPath));

// ✅ Routes API
app.use('/api/auth', authRoutes);
app.use('/api/avis', avisRoutes);
app.use('/api/recherche', rechercheRoutes);
app.use('/api/eleves', elevesRoutes);
app.use('/api/parent-services', parentServiceRoutes);
// ✅ AJOUTER CETTE LIGNE - Routes sessions
app.use('/api/sessions', sessionsRoutes);

// ✅ Route de test (sans authentification)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ✅ Route de test AVEC authentification
app.get('/api/auth/test-token', require('./middleware/auth').authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Token valide!', user: req.user.username });
});

// ✅ Servir les documents avec le bon chemin
app.use('/uploads/documents', express.static(path.join(config.uploadPath, 'documents'), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    // Permettre l'accès aux documents depuis le frontend
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    
    // Forcer le téléchargement pour certains types
    if (filePath.endsWith('.pdf')) {
      res.set('Content-Type', 'application/pdf');
    }
  }
}));

// ✅ Démarrer le serveur
const initDatabases = async () => {
  await usersDB.init();
  await precepteursDB.init();
  
  const adminExists = await usersDB.findOne({ role: 'admin' });
  if (!adminExists) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await usersDB.create({
      email: 'admin@excellence.com',
      password: hashedPassword,
      username: 'Admin',
      role: 'admin',
      genre: 'homme',
      email_verified: true,
      photo_profil: null
    });
    console.log('✅ Compte admin créé: admin@excellence.com / admin123');
  }
};

const PORT = config.port;
initDatabases().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur Express démarré sur http://localhost:${PORT}`);
    console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
    console.log(`💾 Base de données: ${config.dataPath}`);
    console.log(`📋 Routes disponibles:`);
    console.log(`   - POST /api/sessions (créer une session)`);
    console.log(`   - GET /api/sessions (lister les sessions)`);
    console.log(`   - PATCH /api/sessions/:id/status (changer statut)`);
    console.log(`   - PUT /api/sessions/:id/notes (mettre à jour notes)`);
  });
}).catch(console.error);

module.exports = app;