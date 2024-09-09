const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

// URI pour MongoDB
const mongoDBUri = 'mongodb://127.0.0.1:27017/PrintEasy';

// Configuration de multer-gridfs-storage
const storage = new GridFsStorage({
  url: mongoDBUri,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads' // Le bucket utilisé pour stocker les fichiers dans GridFS
        };
        resolve(fileInfo);
      });
    });
  }
});

// Instance de multer avec GridFS
const upload = multer({ storage });

module.exports = upload;
