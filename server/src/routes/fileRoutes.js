const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.rs', '.go', '.php', '.sql'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Security Alert: Unsupported file type ${ext}`));
    }
  }
});

const storageService = require('../services/storageService');

router.post('/upload', upload.single('codeFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file detected' });
  }

  try {
    const uploadData = await storageService.uploadFile(
      req.file.path,
      req.file.originalname,
      req.file.mimetype
    );

    const publicUrl = await storageService.getFileUrl(uploadData.path);

    res.json({
      message: 'Source Cluster Synchronized with Cloud Storage',
      filename: req.file.filename,
      originalName: req.file.originalname,
      cloudPath: uploadData.path,
      publicUrl
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Cloud Sync Failed',
      message: error.message 
    });
  }
});

module.exports = router;
