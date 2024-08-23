const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const auth=require('../middleware/auth')

router.post('/add', adminController.addAdmin);
router.post('/login', adminController.login);

module.exports = router;