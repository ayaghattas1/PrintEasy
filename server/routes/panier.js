const express = require('express');
const panierController = require('../controllers/panier');
const router = express.Router();
const auth=require('../middleware/auth')

router.post('/addToPanier/:id',auth.loggedMiddleware, panierController.addToPanier);
router.delete('/removeFromPanier/:id', auth.loggedMiddleware, panierController.removeFromPanier);
router.patch('/updatePanier/:id', auth.loggedMiddleware, panierController.updatePanier);
router.get('/getPanier', auth.loggedMiddleware, panierController.getPanier);
router.get("/getConfirmed",auth.loggedMiddleware, panierController.getConfirmedPaniers);
router.patch('/confirmPanier/:id', auth.loggedMiddleware, panierController.confirmPanier);


module.exports = router;