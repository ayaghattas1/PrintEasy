const express = require("express");
const router = express.Router();
const produitController = require("../controllers/produit");
const auth=require('../middleware/auth')


router.get("/fetchProd/:id", produitController.fetchProduit);
router.get("/getProd", produitController.getProduit);
router.post('/add', produitController.addProduit);
router.patch("/updateProd/:id",auth.loggedMiddleware, produitController.updateProduit);
router.delete("/deleteProd/:id", produitController.deleteProduit);

module.exports = router;
