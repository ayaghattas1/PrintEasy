const Produit = require("../models/produit");
const path = require('path');
const upload = require('../middleware/multer');
const multer = require('multer');


const addProduit = (req, res) => {
  // Utilisation de multer pour gérer l'upload du fichier (image)
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'Erreur de téléchargement de fichier', message: err.message });
    } else if (err) {
      return res.status(500).json({ error: 'Erreur de serveur', message: err.message });
    }

    // Récupérer le chemin de l'image téléchargée
    const imagePath = req.file ? req.file.path : '';

    // Création du produit avec les informations reçues et le chemin de l'image
    const produit = new Produit({
      nom: req.body.nom,
      description: req.body.description,
      prix: req.body.prix,
      categorie: req.body.categorie,
      image: imagePath,  // Le chemin de l'image est sauvegardé dans la base de données
      quantite: req.body.quantite
    });

    // Sauvegarde du produit dans la base de données
    produit.save()
      .then(() => {
        res.status(201).json({
          produit: produit,
          message: 'Produit ajouté avec succès !'
        });
      })
      .catch(error => {
        res.status(400).json({ error: error.message, message: 'Données invalides !' });
      });
  });
};

const getProduit = (req, res) => {
  Produit.find()
    .then((produit) =>
      res.status(200).json({
        Produits: produit,
        message: "success!",
      })
    )

    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "probleme d'extraction des livres ! ",
      });
    });
};

const fetchProduit = (req, res) => {
  Produit.findOne({ _id: req.params.id })
    .then((produit) => {
      if (!produit) {
        res.status(404).json({
          message: "produit non trouvé!",
        });
      } else {
        res.status(200).json({
          produit: produit,
          message: "produit trouvé!",
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "Données invalides!",
      });
    });
};


const updateProduit = (req, res) => {
  Produit.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((produit) => {
      if (!produit) {
        res.status(404).json({
          message: "produit non trouvé!",
        });
      } else {
        res.status(200).json({
          produit: produit,
          message: "produit modifié!",
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "Données invalides!",
      });
    });
};

const deleteProduit = (req, res) => {
    Produit.deleteOne({ _id: req.params.id })
      .then((produits) =>
        res.status(200).json({
          message: "success!",
        })
      )
  
      .catch(() => {
        res.status(400).json({
          error: Error.message,
          message: "probleme d'extraction ",
        });
      });
  };

module.exports = {
  getProduit,
  addProduit,
  fetchProduit,
  updateProduit,
  deleteProduit,
};