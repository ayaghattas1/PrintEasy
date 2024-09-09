const mongoose = require("mongoose");

const demandeSchema = mongoose.Schema({
    description : {type : String, default: ""},
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type : {type:  String,
        enum : ["flyer","affiche","3D"],
     },
    taille : {type:  String,
        enum : ["A4","A3","A2"],
     },
    quantite: {type : Number, required: true},
    createdAt: { type: Date, default: () => moment().toDate() },
    file: [{ 
        type: String,
        validate: {
            validator: function(v) {
                return v.every(fileName => /\.(pdf|docx|jpg|png)$/.test(fileName));
            },
            message: props => `${props.value} contient des fichiers non valides!`
        }
    }],
    finishedAt: { type: Date, required: false },
    date_maximale: {type: Date, required: false},
    livraison: {type: Date},
    etatDemande : {type:  String,
        enum : ["En cours de confirmation","Confirmé","En cours de préparation", "En cours de livraison", "Livré" ],
     },
     prix: {type: Number},

});

module.exports = mongoose.model("Demande", demandeSchema);