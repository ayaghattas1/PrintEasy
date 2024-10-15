const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth=require('../middleware/auth')
const User = require("../models/user");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.patch('/updatePhoto', auth.loggedMiddleware, userController.updateUserPhoto);
router.patch('/updateUser', auth.loggedMiddleware, userController.updateUser);
router.get("/commandes", auth.loggedMiddleware, userController.commandesUser);
router.get("/getU", auth.loggedMiddleware, userController.getUser);
router.get('/current', auth.loggedMiddleware, userController.getUserData);
router.get("/:id", auth.loggedMiddleware,userController.fetchUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

router.get('/notifications', auth.loggedMiddleware, async (req, res) => {
    try {
      // Ensure the user is an admin
      const currentUser = await User.findById(req.auth.userId);
      if (currentUser.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      // Fetch all users' notifications
      const users = await User.find({ role: 'User' });
      const allNotifications = users.flatMap(user => user.notifications);
  
      return res.status(200).json({ notifications: allNotifications });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ message: 'An error occurred while fetching notifications' });
    }
  });

//router.put("/users/:id/mark-as-read", userController.markasread);

module.exports = router;