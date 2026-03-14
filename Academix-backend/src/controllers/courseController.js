const Course = require('../models/Course');
const { cloudinary } = require('../config/cloudinary');

exports.createCourse = async (req, res) => {
  try {

    const { title, tel, filiere, niveau, classe, language } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Le support de cours est requis." });
    }

    const newCourse = new Course({
      title,
      tel,
      filiere,
      niveau,
      classe,
      language,
      fileUrl: req.file.path,
      publicId: req.file.filename,
      uploadedById: req.user.id,  
      uploadedBy: req.user.name || req.body.uploadedBy
    });

    await newCourse.save();
    res.status(201).json({ success: true, course: newCourse });
  } catch (error) {
    console.error("Erreur Backend Save:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const { filiere, niveau } = req.query;
    const filter = {};
    if (filiere) filter.filiere = filiere;
    if (niveau) filter.niveau = niveau;

    const courses = await Course.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course.publicId) {
      await cloudinary.uploader.destroy(course.publicId, { resource_type: 'raw' });
    }
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Cours supprimé." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateCourse = async (req, res) => {
  try {
  
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Document introuvable." });
    }

    if (course.uploadedById.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: "Action interdite : Vous ne pouvez modifier que vos propres cours." 
      });
    }

    const { title, language, tel, filiere, niveau, classe } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        language, 
        tel, 
        filiere, 
        niveau, 
        classe 
        
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ 
      success: true, 
      message: "Cours mis à jour avec succès",
      course: updatedCourse 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};