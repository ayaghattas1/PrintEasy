const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification');
const auth=require('../middleware/auth')

router.get('/', auth.loggedMiddleware, notificationController.getNotifications);
router.post('/mark-as-read', auth.loggedMiddleware, notificationController.markAsRead);
router.post('/delete-old-read', auth.loggedMiddleware, notificationController.deleteOldReadNotifications);

module.exports = router;
