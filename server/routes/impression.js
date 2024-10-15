const express = require("express");
const router = express.Router();
const impressionController = require("../controllers/impression");
const auth=require('../middleware/auth')
const upload = require('../middleware/multer');


router.get("/fetchImp/:id",auth.loggedMiddleware, impressionController.fetchImpression);
router.get("/getImp",auth.loggedMiddleware, auth.isAdmin , impressionController.getImpressions);
router.post('/add',auth.loggedMiddleware, upload.single('file'), impressionController.addImpression);
router.delete("/deleteImp/:id",auth.loggedMiddleware, impressionController.deleteImpression);
router.get("/getMesImp",auth.loggedMiddleware, impressionController.getMesImpressions);
router.patch("/updateImp/:id",auth.loggedMiddleware, impressionController.updateImpression);
router.get('/reports/stats', auth.loggedMiddleware, impressionController.getImpressionStats);

module.exports = router;