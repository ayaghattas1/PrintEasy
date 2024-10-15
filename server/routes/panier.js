const express = require('express');
const panierController = require('../controllers/panier');
const router = express.Router();
const auth=require('../middleware/auth')

router.post('/addToPanier/:id',auth.loggedMiddleware, panierController.addToPanier);
router.delete('/removeFromPanier/:id', auth.loggedMiddleware, panierController.removeFromPanier);
router.get('/getPanier', auth.loggedMiddleware, panierController.getPanier);
router.patch('/updatePanier/:id', auth.loggedMiddleware, panierController.updatePanier);



module.exports = router;