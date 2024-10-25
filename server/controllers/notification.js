const Notification = require('../models/notification');
const cron = require('node-cron');

// Cron job to delete read notifications older than 3 days (runs once daily at midnight)
cron.schedule('0 0 * * *', async () => {
  try {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    // Delete notifications marked as read and older than 3 days
    const result = await Notification.deleteMany({
      read: true,
      date: { $lt: threeDaysAgo },
    });

    console.log(`${result.deletedCount} notifications deleted successfully.`);
  } catch (error) {
    console.error('Error deleting old notifications:', error);
  }
});


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

  exports.deleteOldReadNotifications = async (req, res) => {
    try {
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
        const result = await Notification.deleteMany({ read: true, date: { $lt: threeDaysAgo } });

        return res.status(200).json({ message: `${result.deletedCount} notifications supprimées avec succès.` });
    } catch (error) {
        console.error('Erreur lors de la suppression des notifications anciennes:', error);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};


