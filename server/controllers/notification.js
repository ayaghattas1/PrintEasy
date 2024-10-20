const Notification = require("../models/notification");

exports.getNotifications = async (req, res) => {
    try {
      const userId = req.auth.userId; // Assuming userId is available in req.auth
  
      // Find notifications for the user
      const notifications = await Notification.find({ owner: userId }).sort({ date: -1 }); // Sorting by latest
  
      if (!notifications || notifications.length === 0) {
        return res.status(404).json({ message: 'No notifications found for this user.' });
      }
  
      return res.status(200).json({ success: true, notifications });
    } catch (error) {
      console.error('Error retrieving notifications:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.markAsRead = async (req, res) => {
    try {
      const userId = req.auth.userId; // Assuming userId is available in req.auth
  
      // Update all notifications to mark them as read for the user
      const result = await Notification.updateMany(
        { owner: userId, read: false },
        { $set: { read: true } }
      );
  
      if (result.nModified === 0) {
        return res.status(404).json({ message: 'No unread notifications found.' });
      }
  
      return res.status(200).json({ message: 'All notifications marked as read.' });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };


