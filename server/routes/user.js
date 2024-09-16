const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth=require('../middleware/auth')

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.patch('/updatePhoto', auth.loggedMiddleware, userController.updateUserPhoto);
router.patch('/updateUser', auth.loggedMiddleware, userController.updateUser);
router.get("/commandes", auth.loggedMiddleware, userController.commandesUser);
router.get("/getU", auth.loggedMiddleware, userController.getUser);
router.get('/current', auth.loggedMiddleware, userController.getUserData);

router.get("/:id", auth.loggedMiddleware,userController.fetchUser);

//router.put("/users/:id/mark-as-read", userController.markasread);

module.exports = router;