const Panier = require("../models/panier");
const User = require("../models/user");
const Produit = require("../models/produit");

const addToPanier = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const produitId = req.params.id; // ID du produit passé dans les paramètres de la route
    const { quantite } = req.body; // Quantité optionnelle envoyée dans le corps de la requête, par défaut 1 si non spécifiée

    // Vérifie si le produit existe
    const produit = await Produit.findById(produitId);
    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé !" });
    }

    // Trouve le panier de l'utilisateur ou en crée un nouveau s'il n'existe pas
    let panier = await Panier.findOne({ user: userId });

    if (!panier) {
      panier = new Panier({
        user: userId,
        produits: [{ produit: produitId, quantite: quantite || 1 }] // Ajoute le produit avec la quantité par défaut à 1
      });
    } else {
      // Vérifie si le produit est déjà dans le panier
      const produitIndex = panier.produits.findIndex(p => p.produit.toString() === produitId);

      if (produitIndex > -1) {
        // Si le produit est déjà dans le panier, mets à jour la quantité
        panier.produits[produitIndex].quantite += quantite || 1;
      } else {
        // Sinon, ajoute le produit au panier
        panier.produits.push({ produit: produitId, quantite: quantite || 1 });
      }
    }

    // Sauvegarde les changements dans le panier
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

      // Récupérer le panier avec les informations des produits
      const panier = await Panier.findOne({ user: userId }).populate('produits.produit');
      if (!panier) {
        return res.status(404).json({ message: "Panier non trouvé !" });
      }
  
      // Calcul des prix pour chaque produit et du prix total du panier
      let prixTotalPanier = 0;
  
      const produitsAvecPrix = panier.produits.map(item => {
        const prixUnitaire = item.produit.prix;
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
  
      return res.status(200).json({
        produits: produitsAvecPrix,
        prixTotalPanier, // Prix total du panier
        message: "Panier récupéré avec succès !"
      });
    } catch (error) {
      return res.status(500).json({ error: error.message, message: "Erreur lors de la récupération du panier" });
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

//   const calculerPrixProduit = async (req, res) => {
//     try {
//       const produitId = req.params.id; // ID du produit
//       const userId = req.auth.id; // ID de l'utilisateur connecté
  
//       // Récupérer le panier de l'utilisateur
//       const panier = await Panier.findOne({ user: userId }).populate('produits.produit');
//       if (!panier) {
//         return res.status(404).json({ message: "Panier non trouvé !" });
//       }
  
//       // Trouver le produit dans le panier
//       const produitInPanier = panier.produits.find(p => p.produit._id.toString() === produitId);
//       if (!produitInPanier) {
//         return res.status(404).json({ message: "Produit non trouvé dans le panier !" });
//       }
  
//       // Calculer le prix total du produit
//       const prixTotalProduit = produitInPanier.produit.prix * produitInPanier.quantite;
  
//       return res.status(200).json({ prixTotalProduit, message: "Prix total du produit calculé avec succès !" });
//     } catch (error) {
//       return res.status(500).json({ error: error.message, message: "Erreur lors du calcul du prix du produit" });
//     }
//   };
  
//   const calculerPrixTotalPanier = async (req, res) => {
//     try {
//       const userId = req.auth.id; // ID de l'utilisateur connecté
  
//       // Récupérer le panier de l'utilisateur avec les produits
//       const panier = await Panier.findOne({ user: userId }).populate('produits.produit');
//       if (!panier) {
//         return res.status(404).json({ message: "Panier non trouvé !" });
//       }
  
//       // Calculer le prix total de tous les produits dans le panier
//       const prixTotal = panier.produits.reduce((total, produitInPanier) => {
//         return total + (produitInPanier.produit.prix * produitInPanier.quantite);
//       }, 0);
  
//       return res.status(200).json({ prixTotal, message: "Prix total du panier calculé avec succès !" });
//     } catch (error) {
//       return res.status(500).json({ error: error.message, message: "Erreur lors du calcul du prix total du panier" });
//     }
//   };
  
  
  
  module.exports = {
    removeFromPanier,
    addToPanier,
    getPanier,
    updatePanier,

};