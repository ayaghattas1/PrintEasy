const Panier = require("../models/panier");
const User = require("../models/user");
const Produit = require("../models/produit");

const express = require('express');
const panier = require("../models/panier");
const router = express.Router();

const addToPanier = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const produitId = req.params.id;

        // Vérifiez si le produit existe
        const produit = await Produit.findById(produitId);
        if (!produit) {
            return res.status(404).json({ message: "Produit non trouvé !" });
        }

        // Trouvez le panier de l'utilisateur ou créez-en un nouveau
        let panier = await Panier.findOne({ user: userId });

        if (!panier) {
            panier = new Panier({
                user: userId,
                produits: [{ produit: produitId, quantite: 1 }] // Quantité par défaut à 1
            });
        } else {
            // Ajoutez le produit au panier
            const produitIndex = panier.produits.findIndex(p => p.produit.toString() === produitId);
            if (produitIndex === -1) {
                panier.produits.push({ produit: produitId, quantite: 1 });
            } else {
                // Si le produit existe déjà, vous pouvez décider de mettre à jour la quantité ici
                panier.produits[produitIndex].quantite += 1; // Par exemple, augmenter la quantité
            }
        }

        // Enregistrez les changements dans le panier
        await panier.save();

        return res.status(200).json({ message: "Produit ajouté au panier avec succès !" });
    } catch (error) {
        return res.status(500).json({ error: error.message, message: "Erreur lors de l'ajout au panier" });
    }
};



const removeFromPanier = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const produitId = req.params.id; // ID du produit à supprimer passé dans les paramètres de la route
  
      // Vérifie si le panier de l'utilisateur existe
      let panier = await Panier.findOne({ user: userId });
      if (!panier) {
        return res.status(404).json({ message: "Panier non trouvé pour cet utilisateur !" });
      }
  
      // Vérifie si le produit est dans le panier
      const produitIndex = panier.produits.findIndex(p => p.produit.toString() === produitId);
      if (produitIndex === -1) {
        return res.status(404).json({ message: "Produit non trouvé dans le panier !" });
      }
  
      // Supprime le produit du panier
      panier.produits.splice(produitIndex, 1);
  
      // Sauvegarde le panier mis à jour
      await panier.save();
  
      return res.status(200).json({ message: "Produit supprimé du panier avec succès !" });
    } catch (error) {
      return res.status(500).json({ error: error.message, message: "Erreur lors de la suppression du produit du panier" });
    }
  };

  const getPanier = async (req, res) => {
    try {
        const userId = req.auth.userId;
        console.log("id", userId);

        // Récupérer le panier avec les informations des produits et des impressions
        const panier = await Panier.findOne({ user: userId })
            .populate('produits.produit')
            .populate('impressions.impression'); // Populate impressions

        if (!panier) {
            return res.status(404).json({ message: "Panier non trouvé !" });
        }

        // Initialiser le prix total du panier
        let prixTotalPanier = 0;

        // Calcul des prix pour chaque produit
        const produitsAvecPrix = panier.produits.map(item => {
            const prixUnitaire = parseFloat(item.produit.prix); // Convertir en nombre
            const quantite = item.quantite;
            const prixTotalProduit = prixUnitaire * quantite;

            // Ajouter au prix total du panier
            prixTotalPanier += prixTotalProduit;

            return {
                produit: item.produit,
                quantite: quantite,
                prixTotalProduit: prixTotalProduit // Prix total de ce produit
            };
        });

        // Calcul des prix pour chaque impression
        const impressionsAvecPrix = panier.impressions.map(item => {
            // Assuming your Impression model has a field `prixfinal`
            const impressionPrixTotal = parseFloat(item.impression.prixfinal) || 0; // Use the appropriate field for total price

            // Ajouter au prix total du panier
            prixTotalPanier += impressionPrixTotal;

            return {
                impression: item.impression,
                prixTotal: impressionPrixTotal // Total price of the impression
            };
        });

        // Return the panier including _id
        return res.status(200).json({
            _id: panier._id, // Ensure _id is included here
            produits: produitsAvecPrix,
            impressions: impressionsAvecPrix, // Include impressions in the response
            prixTotalPanier, // Prix total du panier
            message: "Panier récupéré avec succès !"
        });
    } catch (error) {
        return res.status(500).json({ error: error.message, message: "Erreur lors de la récupération du panier" });
    }
};

const getConfirmedPaniers = async (req, res) => {
  try {
    // Fetch all paniers where confirmed is true
    const confirmedPaniers = await Panier.find({ confirmed: true })
      .populate('user', 'firstname email photo') // Populate user details
      .populate('produits.produit')   // Populate products details
      .populate('impressions.impression'); // Populate impressions

    return res.status(200).json(confirmedPaniers);
  } catch (error) {
    return res.status(500).json({ error: error.message, message: "Erreur lors de la récupération des paniers confirmés" });
  }
};

  
  
  
  const updatePanier = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const produitId = req.params.id; // ID du produit à mettre à jour
      const { quantite } = req.body; // Nouvelle quantité passée dans le corps de la requête
  
      // Vérifie si le panier de l'utilisateur existe
      let panier = await Panier.findOne({ user: userId });
      if (!panier) {
        return res.status(404).json({ message: "Panier non trouvé pour cet utilisateur !" });
      }
  
      // Vérifie si le produit est dans le panier
      const produitIndex = panier.produits.findIndex(p => p.produit.toString() === produitId);
      if (produitIndex === -1) {
        return res.status(404).json({ message: "Produit non trouvé dans le panier !" });
      }
  
      // Mise à jour de la quantité
      panier.produits[produitIndex].quantite = quantite;
  
      // Sauvegarde les changements
      await panier.save();
  
      return res.status(200).json({ message: "Quantité du produit mise à jour avec succès !" });
    } catch (error) {
      return res.status(500).json({ error: error.message, message: "Erreur lors de la mise à jour du panier" });
    }
  };
  const confirmPanier = async (req, res) => {
    try {
      const panierId = req.params.id;
      const updatedPanier = await Panier.findByIdAndUpdate(
        panierId, 
        { confirmed: true }, 
        { new: true }
      );
  
      if (!updatedPanier) {
        return res.status(404).json({ message: "Panier not found" });
      }
  
      res.status(200).json({ message: "Panier confirmed successfully", panier: updatedPanier });
    } catch (error) {
      res.status(500).json({ message: "Error confirming Panier", error: error.message });
    }
  };

  
  
  module.exports = {
    removeFromPanier,
    addToPanier,
    getPanier,
    updatePanier,
    confirmPanier,
    getConfirmedPaniers,

};
