const mongoose = require("mongoose")

const userSchema =  mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password : {type: String, required: true},
    lastname : {type: String},
    firstname : {type: String},
    phone : {type: String},
    address : {type: String},

    photo:{type: String,  required: false},
    commandes: [{
        type: mongoose.Types.ObjectId,
        ref: 'Commande',
        required: false
    }],
    notifications: [
        {
          message: { type: String, required: true },
          date: { type: Date, default: Date.now },
          read: { type: Boolean, default: false },
        }
      ],})

module.exports = mongoose.model("User", userSchema)