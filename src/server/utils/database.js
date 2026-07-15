// const fs = require('fs').promises;
// const path = require('path');
// const config = require('../config');

// class JSONDatabase {
//   constructor(filename) {
//     this.filePath = path.join(config.dataPath, filename);
//     this.data = null;
//   }

//   async init() {
//     try {
//       // Créer le dossier data s'il n'existe pas
//       await fs.mkdir(config.dataPath, { recursive: true });
      
//       const fileData = await fs.readFile(this.filePath, 'utf8');
//       this.data = JSON.parse(fileData);
//     } catch (error) {
//       if (error.code === 'ENOENT') {
//         this.data = [];
//         await this.save();
//       } else {
//         throw error;
//       }
//     }
//   }

//   async save() {
//     await fs.writeFile(this.filePath, JSON.stringify(this.data, null, 2));
//   }

//   async findAll(query = {}) {
//     return this.data.filter(item => {
//       return Object.entries(query).every(([key, value]) => item[key] === value);
//     });
//   }

//   async findOne(query) {
//     return this.data.find(item => {
//       return Object.entries(query).every(([key, value]) => item[key] === value);
//     });
//   }

//   async findById(id) {
//     return this.data.find(item => item.id === id);
//   }

//   async create(newItem) {
//     const item = {
//       id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       ...newItem
//     };
//     this.data.push(item);
//     await this.save();
//     return item;
//   }

//   async update(id, updates) {
//     const index = this.data.findIndex(item => item.id === id);
//     if (index === -1) return null;

//     this.data[index] = {
//       ...this.data[index],
//       ...updates,
//       updated_at: new Date().toISOString()
//     };
//     await this.save();
//     return this.data[index];
//   }

//   async delete(id) {
//     const index = this.data.findIndex(item => item.id === id);
//     if (index === -1) return false;

//     this.data.splice(index, 1);
//     await this.save();
//     return true;
//   }
// }

// // Initialiser les bases de données
// const usersDB = new JSONDatabase('users.json');
// const precepteursDB = new JSONDatabase('precepteurs.json');

// module.exports = { usersDB, precepteursDB, JSONDatabase };


const fs = require('fs').promises;
const path = require('path');
const config = require('../config');

class JSONDatabase {
  constructor(filename) {
    this.filename = filename;
    this.filePath = path.join(config.dataPath, filename);
    this.data = [];
  }

  async init() {
    try {
      // Créer le dossier data s'il n'existe pas
      await fs.mkdir(config.dataPath, { recursive: true });
      
      let fileData;
      try {
        fileData = await fs.readFile(this.filePath, 'utf8');
      } catch (readError) {
        if (readError.code === 'ENOENT') {
          // Fichier n'existe pas, créer un tableau vide
          console.log(`📄 Création du fichier: ${this.filename}`);
          this.data = [];
          await this.save();
          return;
        }
        throw readError;
      }
      
      // ✅ Vérifier si le fichier est vide
      if (!fileData || fileData.trim() === '') {
        console.log(`⚠️ Fichier vide: ${this.filename}, initialisation à []`);
        this.data = [];
        await this.save();
        return;
      }
      
      // Parser le JSON
      try {
        const parsed = JSON.parse(fileData);
        
        // ✅ Vérifier que c'est bien un tableau
        if (!Array.isArray(parsed)) {
          console.warn(`⚠️ ${this.filename} n'est pas un tableau (type: ${typeof parsed}), réinitialisation à []`);
          this.data = [];
          await this.save();
        } else {
          this.data = parsed;
        }
      } catch (parseError) {
        console.error(`❌ JSON invalide dans ${this.filename}:`, parseError.message);
        console.log(`📄 Contenu problématique:`, fileData.substring(0, 100));
        this.data = [];
        await this.save();
      }
      
    } catch (error) {
      console.error(`❌ Erreur critique init() pour ${this.filename}:`, error.message);
      // En dernier recours, initialiser à un tableau vide
      this.data = [];
    }
  }

  async save() {
    try {
      // ✅ S'assurer que data est toujours un tableau avant de sauvegarder
      if (!Array.isArray(this.data)) {
        console.warn(`⚠️ Tentative de sauvegarde de données non-tableau pour ${this.filename}, correction...`);
        this.data = [];
      }
      await fs.writeFile(this.filePath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error(`❌ Erreur sauvegarde ${this.filename}:`, error.message);
      throw error;
    }
  }

  async findAll(query = {}) {
    // ✅ Sécurité : s'assurer que data est un tableau
    if (!Array.isArray(this.data)) {
      console.error(`❌ ERREUR CRITIQUE: this.data n'est pas un tableau dans ${this.filename}!`);
      console.error(`   Type: ${typeof this.data}, Valeur:`, this.data);
      this.data = [];
      await this.save();
      return [];
    }
    
    try {
      return this.data.filter(item => {
        return Object.entries(query).every(([key, value]) => item[key] === value);
      });
    } catch (error) {
      console.error(`❌ Erreur findAll() dans ${this.filename}:`, error.message);
      return [];
    }
  }

  async findOne(query) {
    // ✅ Sécurité
    if (!Array.isArray(this.data)) {
      console.error(`❌ this.data n'est pas un tableau dans ${this.filename}!`);
      this.data = [];
      return null;
    }
    
    try {
      return this.data.find(item => {
        return Object.entries(query).every(([key, value]) => item[key] === value);
      }) || null;
    } catch (error) {
      console.error(`❌ Erreur findOne() dans ${this.filename}:`, error.message);
      return null;
    }
  }

  async findById(id) {
    // ✅ Sécurité
    if (!Array.isArray(this.data)) {
      console.error(`❌ this.data n'est pas un tableau dans ${this.filename}!`);
      this.data = [];
      return null;
    }
    
    try {
      return this.data.find(item => item.id === id) || null;
    } catch (error) {
      console.error(`❌ Erreur findById() dans ${this.filename}:`, error.message);
      return null;
    }
  }

  async create(newItem) {
    // ✅ Sécurité
    if (!Array.isArray(this.data)) {
      console.error(`❌ this.data n'est pas un tableau dans ${this.filename}, réinitialisation...`);
      this.data = [];
    }
    
    try {
      const item = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...newItem
      };
      this.data.push(item);
      await this.save();
      return item;
    } catch (error) {
      console.error(`❌ Erreur create() dans ${this.filename}:`, error.message);
      throw error;
    }
  }

  async update(id, updates) {
    // ✅ Sécurité
    if (!Array.isArray(this.data)) {
      console.error(`❌ this.data n'est pas un tableau dans ${this.filename}!`);
      this.data = [];
      return null;
    }
    
    try {
      const index = this.data.findIndex(item => item.id === id);
      if (index === -1) {
        console.warn(`⚠️ Élément non trouvé pour update: id=${id} dans ${this.filename}`);
        return null;
      }

      this.data[index] = {
        ...this.data[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      await this.save();
      return this.data[index];
    } catch (error) {
      console.error(`❌ Erreur update() dans ${this.filename}:`, error.message);
      return null;
    }
  }

  async delete(id) {
    // ✅ Sécurité
    if (!Array.isArray(this.data)) {
      console.error(`❌ this.data n'est pas un tableau dans ${this.filename}!`);
      this.data = [];
      return false;
    }
    
    try {
      const index = this.data.findIndex(item => item.id === id);
      if (index === -1) {
        console.warn(`⚠️ Élément non trouvé pour delete: id=${id} dans ${this.filename}`);
        return false;
      }

      this.data.splice(index, 1);
      await this.save();
      return true;
    } catch (error) {
      console.error(`❌ Erreur delete() dans ${this.filename}:`, error.message);
      return false;
    }
  }
}

// Initialiser les bases de données principales
const usersDB = new JSONDatabase('users.json');
const precepteursDB = new JSONDatabase('precepteurs.json');

// Initialiser au chargement du module
(async () => {
  try {
    await usersDB.init();
    await precepteursDB.init();
    console.log('✅ Bases de données principales initialisées');
  } catch (error) {
    console.error('❌ Erreur initialisation bases de données:', error.message);
  }
})();

module.exports = { usersDB, precepteursDB, JSONDatabase };