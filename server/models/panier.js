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
  ],

  impressions: [{
  
      impression : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Impression',
        required: true
    }
  }],
  confirmed: { type: Boolean, default: false},
  
}
);

module.exports = mongoose.model("Panier", panierSchema);
