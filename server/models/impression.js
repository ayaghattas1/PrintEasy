const mongoose = require("mongoose");
const moment = require('moment');

const impressionSchema = mongoose.Schema({
    description: { type: String, default: "" },
    taille: { 
        type: String,
        enum: ["A4", "A3", "A2", "A1"],
    },
    couleur: { 
        type: String,
        enum: ["Noir/Blanc", "Couleurs"],
    },
    typeImpr: { 
        type: String,
        enum: ["Laser", "Impression Normale"],
    },
    nbPages: { type: Number, required: true },
    nbFois: { type: Number, required: true },
    file: { 
        type: [String], 
        validate: {
            validator: function(v) {
                return v.every(fileName => /\.(pdf|docx|jpg|png)$/.test(fileName));
            },
            message: props => `${props.value} contient des fichiers non valides!`
        }
    },
    date_maximale: { type: Date, required: false },
    livraison: { 
        type: String,
        enum: ["Livraison +4DT", "Sur place"],
    },
    prixunitaire: { type: Number },
    prixfinal: { type: Number },
    etat: { 
        type: String, 
        enum: ["En cours de confirmation", "Confirmé", "Délivré", "Prêt", "Annulé"],
        default: "En cours de confirmation"
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: { type: Date, default: moment().toDate() },
});

module.exports = mongoose.model("Impression", impressionSchema);



