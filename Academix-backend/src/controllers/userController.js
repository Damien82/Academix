const User = require('../models/User');

// Récupérer tous les utilisateurs (Sauf Admin)
exports.getAllUsers = async (req, res) => {
  try {
    // Filtrage à la source : on ne récupère jamais les admins
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur de récupération." });
  }
};

// Modifier le statut (Toggle)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 1. Trouver l'utilisateur cible
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // 2. Bloquer toute action si c'est un admin
    if (targetUser.role === 'admin') {
      return res.status(403).json({ message: "Action interdite sur un administrateur." });
    }

    // 3. Mise à jour
    targetUser.status = status;
    await targetUser.save();

    res.status(200).json({ success: true, user: targetUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur lors de la mise à jour." });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérification de sécurité avant suppression
    const targetUser = await User.findById(id);
    if (!targetUser) return res.status(404).json({ message: "Utilisateur introuvable." });
    
    if (targetUser.role === 'admin') {
      return res.status(403).json({ message: "Impossible de supprimer un compte administrateur." });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur lors de la suppression." });
  }
};

// Mise à jour du rôle d'un utilisateur
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // 1. Liste des rôles autorisés (pour éviter d'injecter n'importe quoi)
    const rolesAutorises = ['student', 'delegate'];

    if (!rolesAutorises.includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: "Rôle non valide." 
      });
    }

    // 2. Mise à jour de l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: role },
      { new: true, runValidators: true }
    ).select('-password'); // On ne renvoie jamais le mot de passe

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: "Utilisateur introuvable." 
      });
    }

    res.status(200).json({
      success: true,
      message: `Rôle mis à jour : ${role}`,
      user: updatedUser
    });

  } catch (error) {
    console.error("Erreur mise à jour rôle:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur lors de la mise à jour du rôle." 
    });
  }
};