const express = require("express");
const app = express();
//require("dotenv").config({ path: './.env' });
const mongoose = require("mongoose");
const userRouter=require("./routes/user")
//const commandeRouter=require("./routes/commande")
const produitRouter=require("./routes/produit")
const adminRouter=require("./routes/admin")
const cors = require('cors');
app.use(cors())
app.use(express.json());
app.use(express.static('uploads'));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Heders",
    "Origin,X-Requsted-With,Content,Accept,Content-Type,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  next();
});

const mongoDBUri = 'mongodb://127.0.0.1:27017/PrintEasy';
mongoose.connect(mongoDBUri
).then(() => console.log("connexion a MongoDB reussie!"))
.catch((e) => console.log("connexion a MongoDB échouée!",e))

app.use("/user", userRouter)
 //app.use("/commande", commandeRouter)
app.use("/produit", produitRouter)
app.use("/admin", adminRouter)
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'middleware', 'uploads')));

app.use((req, res, next) => {
  console.log(req.headers);
  next();
});
module.exports = app;