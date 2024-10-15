const mongoose = require("mongoose");

const panierSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  produits: [
    {
      produit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produit',
        required: true
      },
      quantite: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ]
});

module.exports = mongoose.model("Panier", panierSchema);