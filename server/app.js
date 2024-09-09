const express = require("express");
const app = express();
//require("dotenv").config({ path: './.env' });
const mongoose = require("mongoose");
const userRouter=require("./routes/user")
const impressionRouter=require("./routes/impression")
const produitRouter=require("./routes/produit")
const adminRouter=require("./routes/admin")
const Grid = require("gridfs-stream");
const cors = require('cors');
app.use(cors())
app.use(express.json());
app.use(express.static('uploads'));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Heders",
    "Origin,X-Requsted-With,Content,Accept,Content-Type,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  next();
});

const mongoDBUri = 'mongodb://127.0.0.1:27017/PrintEasy';
mongoose.connect(mongoDBUri
).then(() => console.log("connexion a MongoDB reussie!"))
.catch((e) => console.log("connexion a MongoDB échouée!",e))

const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');

  // Route pour récupérer les fichiers
  app.get('/file/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      if (err || !file) {
        return res.status(404).json({ err: 'Aucun fichier trouvé' });
      }

      // Définissez le type MIME du fichier
      res.set('Content-Type', file.contentType);

      const readstream = gfs.createReadStream(file.filename);
      readstream.on('error', () => {
        res.status(500).json({ err: 'Erreur lors de la lecture du fichier' });
      });
      readstream.pipe(res);
    });
  });
});

app.use("/user", userRouter)
 app.use("/impression", impressionRouter)
app.use("/produit", produitRouter)
app.use("/admin", adminRouter)
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'middleware', 'uploads')));

app.use((req, res, next) => {
  console.log(req.headers);
  next();
});
module.exports = app;