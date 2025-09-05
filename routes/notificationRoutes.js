const express = require("express");
const router = express.Router();
const {
  getMyNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const {verifyToken} = require("../middlewares/isAdmin");

router.get("/", verifyToken, getMyNotifications);
router.patch("/:id/read", verifyToken, markAsRead);
router.delete("/:id", verifyToken, deleteNotification);

module.exports = router;
