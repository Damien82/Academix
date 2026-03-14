const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==========================================
// INSCRIPTION (REGISTER)
// ==========================================
exports.register = async (req, res) => {
  try {
    const { 
      fullName, email, phone, classe, filiere, 
      niveau, section, password, role 
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "Cet email est déjà utilisé." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      phone,
      classe,
      filiere,
      niveau,
      section,
      password: hashedPassword,
      role: role || 'student',
      lastLogin: Date.now() // Initialisation à la création
    });

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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Identifiants invalides." });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ 
        success: false, 
        message: "Votre compte a été suspendu. Veuillez contacter l'administration." 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Identifiants invalides." });
    }

    // 🔹 --- MISE À JOUR DU LAST LOGIN ---
    // Cette étape rend le calcul du taux d'activité dynamique et réel
    user.lastLogin = Date.now();
    await user.save(); 

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("ERREUR CRITIQUE: JWT_SECRET manquant");
      return res.status(500).json({ success: false, message: "Erreur de configuration serveur." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, status: user.status },
      secret,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      token,
      role: user.role,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin // Optionnel : renvoyer la date au front
      }
    });

  } catch (error) {
    console.error("ERREUR LOGIN DETAILEE :", error.message);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la connexion." });
  }
};