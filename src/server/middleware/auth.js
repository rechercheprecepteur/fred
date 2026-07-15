const jwt = require('jsonwebtoken');
const config = require('../config');
const { usersDB } = require('../utils/database');

const authenticateToken = async (req, res, next) => {
  try {
    // ✅ Vérifier le token dans le cookie OU le header Authorization
    let token = null;
    
    // D'abord vérifier le cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log('🔑 Token trouvé dans les cookies');
    }
    
    // Ensuite vérifier le header Authorization
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
        console.log('🔑 Token trouvé dans le header Authorization');
      }
    }
    
    // Debug
    console.log('🔍 Token présent:', !!token);
    if (token) {
      console.log('🔍 Token (début):', token.substring(0, 30) + '...');
    }
    
    if (!token) {
      console.log('❌ Aucun token trouvé');
      return res.status(401).json({ error: 'Token d\'authentification requis' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    console.log('✅ Token décodé:', decoded);
    
    const user = await usersDB.findById(decoded.userId);
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé pour:', decoded.userId);
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    console.log('✅ Utilisateur authentifié:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Erreur authentification:', error.message);
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

module.exports = { authenticateToken };