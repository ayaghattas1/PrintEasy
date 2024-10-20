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

// impressionSchema.pre('save', function(next) {
//     if (this.isModified('nbPages') || this.isModified('nbFois') || this.isModified('couleur') || this.isModified('typeImpr')) {
//         const totalPages = this.nbPages * this.nbFois;
//         let prixUnitaire = 0;

//         if (this.couleur === 'Couleurs' && this.typeImpr === 'Laser') {
//             prixUnitaire = totalPages < 50 ? 120 : 90;
//         } else if (this.couleur === 'Couleurs' && this.typeImpr === 'Impression Normale') {
//             prixUnitaire = totalPages < 50 ? 100 : 80;
//         } else if (this.couleur === 'Noir/Blanc' && this.typeImpr === 'Laser') {
//             prixUnitaire = totalPages < 50 ? 70 : 50;
//         } else if (this.couleur === 'Noir/Blanc' && this.typeImpr === 'Impression Normale') {
//             prixUnitaire = totalPages < 50 ? 50 : 35;
//         }

//         this.prixunitaire = prixUnitaire;
//         this.prixfinal = prixUnitaire * totalPages;
//     }
//     next();
// });


