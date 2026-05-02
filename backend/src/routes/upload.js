const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const auth = require('../middleware/auth');

const router = express.Router();

// Cloudinary é configurado via CLOUDINARY_URL no .env
// Formato: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
// Obtido em: https://cloudinary.com → Dashboard → API Keys

const upload = multer({
  storage: multer.memoryStorage(), // buffer em memória, sem disco
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato inválido. Aceitos: JPG, PNG, WEBP'));
    }
  },
});

// POST /api/upload — protegido, só admin
router.post('/', auth, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhuma imagem enviada' });
  }

  if (!process.env.CLOUDINARY_URL) {
    return res.status(503).json({ error: 'Serviço de upload não configurado. Defina CLOUDINARY_URL.' });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'equesto/listings',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
  }
});

// Middleware de erro do multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Imagem muito grande. Máximo 5 MB.' });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

module.exports = router;
