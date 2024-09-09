const Produit = require("../models/produit");
const upload = require('../middleware/multer');
const multer = require('multer');
const path = require('path');

const addProduit = (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'Erreur de téléchargement de fichier', message: err.message });
    } else if (err) {
      return res.status(500).json({ error: 'Erreur de serveur', message: err.message });
    }

    // Conserver seulement le chemin relatif à partir du dossier "uploads"
    const imagePath = req.file ? `/uploads/${req.file.filename}` : ''; 

    const produit = new Produit({
      nom: req.body.nom,
      description: req.body.description,
      prix: req.body.prix,
      image: imagePath,  // Stocker le chemin relatif
      quantite: req.body.quantite
    });

    produit.save()
      .then(() => res.status(201).json({ produit, message: 'Produit ajouté avec succès !' }))
      .catch(error => res.status(400).json({ error: error.message, message: 'Données invalides !' }));
  });
};

// Récupération de tous les produits
const getProduit = (req, res) => {
  Produit.find()
    .then(produits => res.status(200).json({ produits, message: "Produits récupérés avec succès !" }))
    .catch(error => res.status(400).json({ error: error.message, message: "Problème de récupération des produits !" }));
};

// Récupération d'un produit par ID
const fetchProduit = (req, res) => {
  Produit.findById(req.params.id)
    .then(produit => {
      if (!produit) {
        return res.status(404).json({ message: "Produit non trouvé !" });
      }
      res.status(200).json({ produit, message: "Produit récupéré avec succès !" });
    })
    .catch(error => res.status(400).json({ error: error.message, message: "Données invalides !" }));
};

// Mise à jour d'un produit
const updateProduit = (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'Erreur de téléchargement de fichier', message: err.message });
    } else if (err) {
      return res.status(500).json({ error: 'Erreur de serveur', message: err.message });
    }

    const updateData = {
      nom: req.body.nom,
      description: req.body.description,
      prix: req.body.prix,
      categorie: req.body.categorie,
      quantite: req.body.quantite,
    };

    if (req.file) {
      updateData.image = path.normalize(req.file.path); // Mettre à jour le chemin de l'image
    }

    Produit.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .then(produit => {
        if (!produit) {
          return res.status(404).json({ message: "Produit non trouvé !" });
        }
        res.status(200).json({ produit, message: "Produit mis à jour avec succès !" });
      })
      .catch(error => res.status(400).json({ error: error.message, message: "Données invalides !" }));
  });
};

// Suppression d'un produit
const deleteProduit = (req, res) => {
  Produit.findByIdAndDelete(req.params.id)
    .then(produit => {
      if (!produit) {
        return res.status(404).json({ message: "Produit non trouvé !" });
      }
      res.status(200).json({ message: "Produit supprimé avec succès !" });
    })
    .catch(error => res.status(400).json({ error: error.message, message: "Problème lors de la suppression du produit !" }));
};

module.exports = {
  getProduit,
  addProduit,
  fetchProduit,
  updateProduit,
  deleteProduit,
};
