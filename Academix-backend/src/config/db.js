const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Utilise bien 127.0.0.1 dans ton .env
    await mongoose.connect(process.env.MONGO_URI); 
    console.log('Connexion à MongoDB réussie !');
  } catch (err) {
    console.error('Erreur de connexion MongoDB :', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;