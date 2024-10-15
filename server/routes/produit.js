const express = require("express");
const router = express.Router();
const produitController = require("../controllers/produit");
const auth=require('../middleware/auth')


router.get("/fetchProd/:id",auth.loggedMiddleware, produitController.fetchProduit);
router.get("/getProd", produitController.getProduit);
router.post('/add',auth.loggedMiddleware, auth.isAdmin, produitController.addProduit);
router.patch("/updateProd/:id",auth.loggedMiddleware, produitController.updateProduit);
router.delete("/deleteProd/:id",auth.loggedMiddleware, produitController.deleteProduit);

module.exports = router;
