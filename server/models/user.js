const mongoose = require("mongoose")

const userSchema =  mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password : {type: String, required: true},
    lastname : {type: String},
    firstname : {type: String},
    phone : {type: String},
    address : {type: String},
    role : { 
      type: String, 
      enum: ["User", "Admin"],
      default: "User"
  },
    photo:{type: String,  required: false},
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    notifications: [
        {
          message: { type: String, required: true },
          date: { type: Date, default: Date.now },
          read: { type: Boolean, default: false },
        }
      ],
  })
  
module.exports = mongoose.model("User", userSchema)