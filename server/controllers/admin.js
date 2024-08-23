const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


const addAdmin = (req, res) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const admin = new Admin({
          email: req.body.email,
          password: hash,
          nom : req.body.nom,
          notifications: [],
        });
        admin
          .save()
          .then((response) => {
            const newAdmin = response.toObject();
            delete newAdmin.password;
            res.status(201).json({
              admin: newAdmin,
              message: "Admin créé !",
            });
          })
          .catch((error) => {
            res
              .status(400)
              .json({ error: error.message, message: "Données invalides" });
          });
      });
    };

const login = (req, res, next) => {
    Admin.findOne({ email: req.body.email })
      .then((admin) => {
        if (!admin) {
          return res.status(401).json({
            error: "admin not found",
          });
        }
        bcrypt
          .compare(req.body.password, admin.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({
                error: "login ou mot de passe incorrecte !",
              });
            }
            const token = jwt.sign(
              { adminId: admin._id }, 
              "RANDOM_TOKEN_SECRET", 
              { expiresIn: "24h" }
            );
            res.status(200).json({
              token: token,
              _id: admin._id,
              nom: admin.nom, 
              notifications: admin.notifications,
            });
          })
          .catch((error) => res.status(500).json({ error: error.message }));
      })
      .catch((error) => res.status(500).json({ error: error.message }));
  };

module.exports = { 
    addAdmin,
    login
 };
