require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // 1. Importe ta fonction de connexion
const authRoutes = require('./routes/authRoutes');

const app = express();

// 2. Connecte-toi à MongoDB avant tout
connectDB(); 

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Route de test
app.get('/', (req, res) => {
  res.send('Serveur Node.js opérationnel !');
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});