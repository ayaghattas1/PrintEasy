const express = require("express");
const router = express.Router();
const impressionController = require("../controllers/impression");
const auth=require('../middleware/auth')
const upload = require('../middleware/multer');


router.get("/fetchProd/:id",auth.loggedMiddleware, impressionController.fetchImpression);
router.get("/getProd",auth.loggedMiddleware, impressionController.getImpression);
router.post('/add',auth.loggedMiddleware, upload.single('file'), impressionController.addImpression);
router.delete("/deleteProd/:id",auth.loggedMiddleware, impressionController.deleteImpression);

module.exports = router;