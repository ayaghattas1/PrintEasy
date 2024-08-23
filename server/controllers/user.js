const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const path = require('path');
const upload = require('../middleware/multer');
const multer = require('multer');

exports.signup = (req, res, next) => {
  //const defaultImagePath = path.join(__dirname, 'uploads');
  
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
      lastname : req.body.lastname,
      firstname : req.body.firstname,
      phone: req.body.phone,
      address: req.body.address,
      photo: "uploads/unknown.png",
      notifications: [],
    });
    user
      .save()
      .then((response) => {
        const newUser = response.toObject();
        delete newUser.password;
        res.status(201).json({
          user: newUser,
          message: "Utilisateur créé !",
        });
      })
      .catch((error) => {
        res
          .status(400)
          .json({ error: error.message, message: "Données invalides" });
      });
  });
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            error: "User not found",
          });
        }
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({
                error: "login ou mot de passe incorrecte !",
              });
            }
            const token = jwt.sign(
              { userId: user._id }, 
              "RANDOM_TOKEN_SECRET", 
              { expiresIn: "24h" }
            );
            res.status(200).json({
              token: token,
              _id: user._id,
              firstname: user.firstname, 
              lastname: user.lastname,   
              phone: user.phone,
              photo: user.photo,
              commandes: user.commandes,
              address: user.address,
              notifications: user.notifications,
            });
          })
          .catch((error) => res.status(500).json({ error: error.message }));
      })
      .catch((error) => res.status(500).json({ error: error.message }));
  };

exports.getUser = (req, res) => {
    User.find()
      .then((users) => {
        res.status(200).json({
          model: users,
          message: "success",
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error.message,
          message: "problème d'extraction",
        });
      });
  };
  exports.updateUser = async (req, res, next) => {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        return res.status(400).json({ error: 'Missing user authentication data' });
      }
  
      // Prepare updates based on the request body
      const updates = {};
      if (req.body.firstname) updates.firstname = req.body.firstname;
      if (req.body.lastname) updates.lastname = req.body.lastname;
      if (req.body.email) updates.email = req.body.email;
      if (req.body.password) {
        const bcrypt = require('bcryptjs');
        const saltRounds = 10;
        updates.password = await bcrypt.hash(req.body.password, saltRounds); // Ensure hashing
      }
      if (req.body.address) updates.address = req.body.address;
      if (req.body.phone) updates.phone = req.body.phone;
  
      // Update the user and return the new document
      const updatedUser = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating user profile:', error); 
      res.status(500).json({
        error: 'Error updating user profile',
        message: error.message || 'An unknown error occurred',
        stack: error.stack || 'No stack trace available' 
      });
    }
  };

  exports.updateUserPhoto = async (req, res, next) => {
    // Use Multer's single-file upload method
    upload.single('photo')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors
        return res.status(400).json({ error: 'File upload error', message: err.message });
      } else if (err) {
        // Handle other errors
        return res.status(500).json({ error: 'File upload error', message: err.message });
      }
      console.log('Uploaded file details:', req.file);  // Log file details

      // Retrieve the authenticated user ID from the request (ensure authentication middleware is used)
      // const userId = req.auth.userId;
  
      // Retrieve the uploaded photo path or use the existing photo if none was uploaded
      const photoPath = req.file ? path.join('uploads', req.file.filename) : req.auth.photo;
      console.log('Constructed photo path:', photoPath);  // Log the photo path

      // Update the user's profile photo path in the database
      try {
        const userId = req.auth.userId;

        const updatedUser = await User.findByIdAndUpdate(userId, { photo: photoPath }, { new: true });
        if (!updatedUser) {
          return res.status(404).json({ error: 'User not found', userId });
        }
        res.status(200).json({ message: 'Profile photo updated successfully', user: updatedUser });
      } catch (error) {
        console.error('Error updating user profile photo:', error);
        res.status(500).json({ error: 'Error updating user profile photo', message: error.message });
      }
    });
  };

  exports.fetchUser = (req, res) => {
    User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        res.status(404).json({
          message: "User non trouvé!",
        });
      } else {
        res.status(200).json({
          model: user,
          message: "User trouvé!",
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "Données invalides!",
      });
    });
};

exports.commandesUser = async (req, res) => {
  if (!req.auth || !req.auth.userId) {
      return res.status(400).json({
          success: false,
          message: "Invalid authentication credentials."
      });
  }

  try {
      const userId = req.auth.userId;
      const user = await User.findOne({ _id: userId }).populate('commandes');

      if (!user) {
          return res.status(404).json({
              success: false,
              message: "Utilisateur non trouvé."
          });
      }

      res.status(200).json({
          success: true,
          message: "Commandes récupérés avec succès.",
          projects: user.projects
      });
  } catch (error) {
      console.error("Erreur lors de la récupération des Commandes de l'utilisateur :", error);
      res.status(500).json({
          success: false,
          message: "Problème lors de l'extraction des Commandes de l'utilisateur.",
          error: error.message
      });
  }
};

// exports.markasread = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const user = await User.findById(userId);
//     if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//     }

//     // Update all notifications to mark them as read
//     user.notifications.forEach(notification => {
//         notification.read = true;
//     });

//     await user.save();

//     res.status(200).json({ message: 'Notifications marked as read' });
// } catch (error) {
//     console.error('Error marking notifications as read:', error);
//     res.status(500).json({ error: 'Internal server error' });
// }
// }