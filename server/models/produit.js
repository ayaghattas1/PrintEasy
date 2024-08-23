const mongoose = require("mongoose");

const produitSchema = mongoose.Schema({
    nom : { type : String, required: true},
    description : {type : String, default: ""},
    prix : {type : String, required: true},
    image : {type : String, required: true},
    quantite : {type : Number, required: false},
});

module.exports = mongoose.model("Produit", produitSchema);