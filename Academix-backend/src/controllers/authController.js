const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==========================================
// INSCRIPTION (REGISTER)
// ==========================================
exports.register = async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      phone, 
      classe, 
      filiere, 
      niveau, 
      section, 
      password,
      role 
    } = req.body;

    // 1. Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "Cet email est déjà utilisé." });
    }

    // 2. Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Créer l'utilisateur avec tous les champs
    const newUser = new User({
      fullName,
      email,
      phone,
      classe,
      filiere,
      niveau,
      section,
      password: hashedPassword,
      role: role || 'student' // Par défaut 'student' si non précisé
    });

    // 4. Sauvegarder dans MongoDB
    await newUser.save();

    res.status(201).json({ 
      success: true,
      message: "Utilisateur créé avec succès !",
      userId: newUser._id 
    });

  } catch (error) {
    console.error("ERREUR REGISTER :", error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de l'inscription." });
  }
};

// ==========================================
// CONNEXION (LOGIN)
// ==========================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Identifiants invalides." });
    }

    // 2. Comparer le mot de passe avec bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Identifiants invalides." });
    }

    // 3. Vérification de la clé secrète (évite le crash 500 si le .env est mal lu)
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("ERREUR CRITIQUE: JWT_SECRET est manquant dans le fichier .env");
      return res.status(500).json({ success: false, message: "Erreur de configuration serveur." });
    }

    // 4. Créer le Token JWT (on inclut l'ID et le rôle)
    const token = jwt.sign(
      { id: user._id, role: user.role || 'student' },
      secret,
      { expiresIn: '1d' }
    );

    // 5. Réponse complète renvoyée au Frontend
    // C'est ici qu'on ajoute le rôle dans l'objet 'user' pour le AuthContext
    res.status(200).json({
      success: true,
      token,
      role: user.role || 'student', // Pour la redirection immédiate : navigate(`/dashboard/${res.role}`)
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role || 'student' // INDISPENSABLE pour le PrivateRoute
      }
    });

  } catch (error) {
    console.error("ERREUR LOGIN DETAILEE :", error.message);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la connexion." });
  }
};