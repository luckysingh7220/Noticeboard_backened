const mongoose = require("mongoose");
const Notification = require("../models/Notification");

// Get notifications for logged-in user
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id})
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  const paramId = req.params.id;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(paramId)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    // Try finding by notification _id
    let notification = await Notification.findOneAndUpdate(
      { _id: paramId, user: userId },
      { read: true },
      { new: true }
    );

    // If not found, try using notice ID instead
    if (!notification) {
      notification = await Notification.findOneAndUpdate(
        { notice: paramId, user: userId },
        { read: true },
        { new: true }
      );
    }

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (err) {
    console.error("Error marking notification as read:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notification" });
  }
};
