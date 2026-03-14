const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'academix_reports',
    allowed_formats: ['pdf'], // On restreint aux PDF pour les rapports
    resource_type: 'raw',    // Important pour les fichiers non-images comme le PDF
  },
});

const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };