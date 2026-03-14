require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // 1. Importe ta fonction de connexion
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');
const courseRoutes = require('./routes/courseRoutes');
const statsRoutes = require('./routes/statsRoutes');
const app = express();

// 2. Connecte-toi à MongoDB avant tout
connectDB(); 

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/stats', statsRoutes);

// Route de test
app.get('/', (req, res) => {
  res.send('Serveur Node.js opérationnel !');
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});