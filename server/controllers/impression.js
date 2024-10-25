const Impression = require("../models/impression");
const Panier = require('../models/panier');
const User = require("../models/user");
const Notification = require("../models/notification");

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


const getImpressions = async (req, res) => {
  try {
    const { etat } = req.query; // Récupérer le paramètre 'etat' de la requête

    // Construire le filtre
    const filter = {};
    if (etat) {
      filter.etat = etat;
    }

    const impressions = await Impression.find(filter) // Appliquer le filtre
      .populate('owner', 'photo')  // Assurez-vous que 'owner' est référencé correctement
      .exec();

    res.json(impressions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des impressions.' });
  }
};



const getMesImpressions = (req, res) => {
  // Extraire l'ID de l'utilisateur connecté depuis le token
  const userId = req.auth.userId; 

  // Filtrer les impressions où 'owner' correspond à l'utilisateur connecté
  Impression.find({ owner: userId })
    .then(impressions => {
      res.status(200).json({
        impressions,
        message: "Impressions récupérées avec succès !"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error.message,
        message: "Problème de récupération des impressions !"
      });
    });
};

const addImpression = async (req, res) => {
  try {
    const userId = req.auth.userId;

    // Fetch user details from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    // Create a new impression with the uploaded file's name in GridFS
    const newImpression = new Impression({
      description: req.body.description || '',
      taille: req.body.taille,
      couleur: req.body.couleur,
      typeImpr: req.body.typeImpr,
      nbPages: req.body.nbPages,
      file: req.file.filename, // File name stored in GridFS
      date_maximale: req.body.date_maximale,
      livraison: req.body.livraison,
      prixunitaire: req.body.prixunitaire,
      prixfinal: req.body.prixfinal,
      nbFois: req.body.nbFois,
      owner: userId,
    });

    // Save the new impression
    const savedImpression = await newImpression.save();

    // Find the user's cart or create a new one if it doesn't exist
    let panier = await Panier.findOne({ user: userId });
    if (!panier) {
      panier = new Panier({
        user: userId,
        produits: [],
        impressions: [],
      });
    }

    // Add the new impression to the user's cart
    panier.impressions.push({ impression: savedImpression._id });

    // Save the updated cart
    await panier.save();

    // Notify admins about the new impression
    const admins = await User.find({ role: 'Admin' });
    const notificationMessage = `L'utilisateur ${user.firstname} ${user.lastname} a ajouté une impression.`;

    const adminNotifications = admins.map(admin => {
      const notification = new Notification({
        owner: admin._id,
        message: notificationMessage,
      });
      return notification.save();
    });

    await Promise.all(adminNotifications);

    return res.status(201).json({
      success: true,
      impression: savedImpression,
      message: 'Impression ajoutée avec succès et ajoutée au panier !'
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
  .populate('owner', 'firstname lastname email phone address photo')
    .then(impression => {
      if (!impression) {
        return res.status(404).json({ message: "impression non trouvé !" });
      }
      res.status(200).json({ impression, message: "impression récupéré avec succès !" });
    })
    .catch(error => res.status(400).json({ error: error.message, message: "Données invalides !" }));
};

const deleteImpression = async (req, res) => {
  try {
    // Step 1: Delete the impression
    const impression = await Impression.findByIdAndDelete(req.params.id);

    // Step 2: Check if the impression exists
    if (!impression) {
      return res.status(404).json({ message: "Impression non trouvé !" });
    }

    // Step 3: Get the user ID from the request
    const userId = req.auth.userId; // Assuming you have the user ID in the request, e.g., from a middleware

    // Step 4: Update the user's cart to remove the impression
    const result = await Panier.updateOne(
      { user: userId },
      { $pull: { impressions: { impression: req.params.id } } } // Remove the impression from the cart
    );

    // Step 5: Check if the update was successful
    if (result.nModified === 0) {
      return res.status(404).json({ message: "Aucune impression trouvée dans le panier." });
    }

    res.status(200).json({ message: "Impression supprimé avec succès !" });
  } catch (error) {
    res.status(400).json({ error: error.message, message: "Problème lors de la suppression !" });
  }
};

const updateImpression = (req, res) => {
  const updateData = {
    description: req.body.description,
    taille: req.body.taille,
    couleur: req.body.couleur,
    typeImpr: req.body.typeImpr,
    nbPages: req.body.nbPages,
    nbFois: req.body.nbFois,
    livraison: req.body.livraison,
    prixunitaire: req.body.prixunitaire,
    prixfinal: req.body.prixfinal,
    date_maximale: req.body.date_maximale,
    etat: req.body.etat,
  };

  if (req.file) {
    updateData.file = req.file.filename;
  }

  Impression.findByIdAndUpdate(req.params.id, updateData, { new: true })
    .then((impression) => {
      if (!impression) {
        return res.status(404).json({ message: "Impression non trouvée !" });
      }

      // Créer une notification pour le propriétaire de l'impression
      const notification = new Notification({
        owner: impression.owner,
        message: `L'état de votre impression "${impression.description}" a été mis à jour à "${impression.etat}".`,
      });

      return notification.save().then(() => {
        res.status(200).json({ impression, message: "Impression mise à jour avec succès !" });
      });
    })
    .catch((error) =>
      res.status(500).json({ error: error.message, message: "Erreur lors de la mise à jour !" })
    );
};


// Controller function
const getImpressionStats = async (req, res) => {
  try {
    // Get statistics for different statuses
    const stats = await Impression.aggregate([
      {
        $group: {
          _id: "$etat",
          count: { $sum: 1 },
          totalPrice: { $sum: "$prixfinal" }
        }
      }
    ]);

    // Calculate total revenue for "Délivré"
    const deliveredStats = stats.find(stat => stat._id === 'Délivré') || { totalPrice: 0 };

    // Respond with the statistics and total revenue
    res.json({
      stats,
      totalRevenue: deliveredStats.totalPrice
    });
  } catch (error) {
    console.error('Error fetching impression stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {
  getImpressions,
  addImpression,
  fetchImpression,
  deleteImpression,
  getMesImpressions,
  updateImpression,
  getImpressionStats,
};