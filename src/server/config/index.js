const path = require('path');

module.exports = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'votre_secret_jwt_super_securise_2024',
  jwtExpiration: '24h',
  dataPath: path.join(__dirname, '..', 'data'),
  uploadPath: path.join(__dirname, '..', 'uploads'),
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxFileSize: 5 * 1024 * 1024,
};