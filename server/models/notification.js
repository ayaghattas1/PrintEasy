const mongoose = require("mongoose")

const notificationSchema =  mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },

  })
  
module.exports = mongoose.model("Notification", notificationSchema)