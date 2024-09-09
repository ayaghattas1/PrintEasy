const Impression = require("../models/impression");
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const mongoDBUri = 'mongodb://127.0.0.1:27017/PrintEasy';

// Connexion à MongoDB et initialisation de GridFS
mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Récupération de tous les produits
const getImpression = (req, res) => {
  Impression.find()
    .then(impressions => res.status(200).json({ impressions, message: "impressions récupérés avec succès !" }))
    .catch(error => res.status(400).json({ error: error.message, message: "Problème de récupération des impression !" }));
};

const addImpression = async (req, res) => {
  try {
    const userId = req.auth.userId;

    // Créez une nouvelle impression en incluant le nom du fichier stocké dans GridFS
    const newImpression = new Impression({
      description: req.body.description || '',
      taille: req.body.taille,
      couleur: req.body.couleur,
      typeImpr: req.body.typeImpr,
      nbPages: req.body.nbPages,
      file: req.file.filename, // Nom du fichier dans GridFS
      date_maximale: req.body.date_maximale,
      livraison: req.body.livraison,
      prixunitaire: req.body.prixunitaire,
      prixfinal: req.body.prixfinal,
      nbFois: req.body.nbFois,
      owner: userId,
    });

    // Enregistrement dans la base de données
    const savedImpression = await newImpression.save();

    return res.status(201).json({
      success: true,
      impression: savedImpression,
      message: 'Impression ajoutée avec succès !'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la création de l'impression.",
      error: error.message
    });
  }
};

// Récupération d'un produit par ID
const fetchImpression = (req, res) => {
  Impression.findById(req.params.id)
    .then(impression => {
      if (!impression) {
        return res.status(404).json({ message: "impression non trouvé !" });
      }
      res.status(200).json({ impression, message: "impression récupéré avec succès !" });
    })
    .catch(error => res.status(400).json({ error: error.message, message: "Données invalides !" }));
};

const deleteImpression = (req, res) => {
  Impression.findByIdAndDelete(req.params.id)
    .then(impression => {
      if (!impression) {
        return res.status(404).json({ message: "Impression non trouvé !" });
      }
      res.status(200).json({ message: "Impression supprimé avec succès !" });
    })
    .catch(error => res.status(400).json({ error: error.message, message: "Problème lors de la suppression !" }));
};

module.exports = {
  getImpression,
  addImpression,
  fetchImpression,
  deleteImpression,
};