
const Notification = require('../models/notification.js');

exports.getNotifications = async (req, res) =>{
  try {
    const userId = req.user._id;

    
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('sender'); 

    res.status(200).json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching notifications' });
  }
}
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params; 

    if (!notificationId) {
      return res.status(400).json({ success: false, message: "Notification ID is required" });
    }

    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: req.userId },
      { isRead: true },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification: updatedNotification,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error marking notification as read" });
  }
};

  exports.deleteNotification = async (req, res) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user._id;

      // Check if the user has permission to delete the notification
      const notification = await Notification.findById(notificationId);
      if (!notification || notification.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized to delete this notification' });
      }   
      await Notification.findByIdAndDelete(notificationId);

      res.status(200).json({ success: true, message: 'Notification deleted' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error deleting notification' });

    }

  }
  exports.deleteAllNotifications = async (req, res) => {
    try {
      const userId = req.user._id;

      
      await Notification.deleteMany({ user: userId });

      res.status(200).json({ success: true, message: 'All notifications deleted' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error deleting notifications' });
    }

  }
  