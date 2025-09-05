const Notice = require("../models/Notice");
const {
  createNotificationForAdmins,
  createNotificationForAllUsers,
} = require("../utils/notificationUtils");
const AUTO_APPROVED_CATEGORIES = ["general"];

const createNotice = async (req, res) => {
  try {
    const { title, message, category } = req.body;
    const userId = req.user?._id;

    const isAutoApproved = AUTO_APPROVED_CATEGORIES.includes(category);

    const newNotice = await Notice.create({
      title,
      message,
      category,
      status: isAutoApproved ? "approved" : "pending",
      user: userId,
    });
    if (isAutoApproved) {
      await createNotificationForAllUsers("general", "A new notice has been posted",newNotice._id);
      await createNotificationForAdmins("general", "A new notice has been posted",newNotice._id);
    } else {
      await createNotificationForAdmins("general", "A new notice needs approval",newNotice._id);
    }

    res.status(201).json({
      message: "Notice created successfully",
      notice: newNotice,
    });
  } catch (err) {
    console.error("Error creating notice:", err);
    res.status(500).json({ message: "Error creating notice", error: err.message });
  }
};



const deleteNotice = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Notice.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createNotice,deleteNotice };
