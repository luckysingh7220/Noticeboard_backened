const Notification = require("../models/Notification");
const User = require("../models/User");

// Create notification for a specific user
exports.createNotification = async (userId, type, message,notice) => {
  try {
    await Notification.create({ user: userId, type, message,notice:notice });
  } catch (err) {
    console.error("Failed to create notification:", err.message);
  }
};

// Create notification for all users
exports.createNotificationForAllUsers = async (type, message,notice) => {
  try {
    const users = await User.find({ role: "user" });
    const notifications = users.map((u) => ({
      user: u._id,
      type,
      message,
      notice:notice
    }));
    await Notification.insertMany(notifications);
  } catch (err) {
    console.error("Failed to notify all users:", err.message);
  }
};

// Create notification for all admins
exports.createNotificationForAdmins = async (type, message,notice) => {
  try {
    const admins = await User.find({ role: "admin" });
    const notifications = admins.map((admin) => ({
      user: admin._id,
      type,
      message,
      notice:notice
    }));
    await Notification.insertMany(notifications);
  } catch (err) {
    console.error("Failed to notify all admins:", err.message);
  }
};
