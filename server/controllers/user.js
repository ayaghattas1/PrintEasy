const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const path = require('path');
const upload = require('../middleware/multer');
const multer = require('multer');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


exports.signup = (req, res, next) => {
  
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
    upload.single('photo')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: 'File upload error', message: err.message });
      } else if (err) {
        return res.status(500).json({ error: 'File upload error', message: err.message });
      }
      console.log('Uploaded file details:', req.file);
  
      const photoPath = req.file ? req.file.filename.replace(/\\/g, '/') : req.auth.photo;
      console.log('Constructed photo path:', photoPath);
  
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

exports.getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId; // L'ID de l'utilisateur est extrait du middleware
    if (!userId) return res.status(401).json({ message: 'Utilisateur non autorisé' });

    const user = await User.findById(userId).select('-password'); // Récupère l'utilisateur sans le mot de passe
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Fonction pour envoyer l'email de réinitialisation
exports.sendResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ayaghattas606@gmail.com",
      pass: "peew vcuf wmhd yvcf",
    },
  });

  const resetUrl = `http://localhost:3000/reset-password/${token}`;

  const mailOptions = {
      from: 'ayaghattas606@gmail.com',
      to: email,
      subject: 'Réinitialisation du mot de passe',
      html: `<p>Vous avez demandé une réinitialisation de mot de passe. Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
             <a href="${resetUrl}">Réinitialiser le mot de passe</a>`
  };

  await transporter.sendMail(mailOptions);
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Générer un token de réinitialisation
      const token = crypto.randomBytes(20).toString('hex');

      // Enregistrer le token et sa date d'expiration
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
      await user.save();

      // Envoyer l'e-mail
      await exports.sendResetEmail(email, token); // Utilisez 'exports.' pour faire référence à la fonction
      res.status(200).json({ message: 'Un e-mail de réinitialisation de mot de passe a été envoyé' });
  } catch (error) {
      console.error('Erreur dans forgotPassword:', error); // Affichez l'erreur dans la console
      res.status(500).json({ message: 'Erreur lors de la demande de réinitialisation', error: error.message });
  }
};


exports.resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const token = req.params.token;

  try {
      const user = await User.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() } // Vérifier si le token n'est pas expiré
      });

      if (!user) {
          return res.status(400).json({ message: 'Token de réinitialisation invalide ou expiré' });
      }

      // Hash le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined; // Réinitialiser le token
      user.resetPasswordExpires = undefined; // Réinitialiser l'expiration
      await user.save();

      res.status(200).json({ message: 'Votre mot de passe a été réinitialisé avec succès' });
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe', error });
  }
};

