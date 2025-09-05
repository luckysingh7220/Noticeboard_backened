const express = require("express");
const router = express.Router();
const { createNotice,deleteNotice } = require("../controllers/noticeController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {isAdmin,verifyToken} = require("../middlewares/isAdmin");
const Notice = require("../models/Notice");
const {
  createNotification,
  createNotificationForAdmins,
  createNotificationForAllUsers,
} = require("../utils/notificationUtils");

// Create notice
router.post("/", isAuthenticated, createNotice);
// Get approved notices (with optional limit)
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0; // e.g. ?limit=3
    const notices = await Notice.find({ status: "approved" })
      .populate("user", "name")
      .sort({ pinned: -1, createdAt: -1 })
      .limit(limit);

    res.json(notices);
  } catch (err) {
    console.error("Error fetching notices:", err);
    res.status(500).json({ message: "Failed to fetch notices" });
  }
});

// Get unapproved (pending) notices for admin
router.get("/admin/unapproved", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const unapprovedNotices = await Notice.find({ status: "pending" })
      .populate("user", "name email");

    res.json(unapprovedNotices);
  } catch (err) {
    console.error("Error fetching unapproved notices:", err.message);
    res.status(500).json({ message: "Failed to fetch unapproved notices" });
  }
});

router.delete("/delete/:id", verifyToken, isAdmin, deleteNotice);
//  Approve a notice (PATCH)
router.patch("/approve/:id", isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    notice.status = "approved";
    await notice.save();
    console.log(notice.user);
    await createNotification(notice.user, "general", "Your notice was approved",notice._id);
    res.json({ message: "Notice approved successfully", notice });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//  Reject a notice (delete it or update status)
router.patch("/reject/:id", isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    notice.status = "rejected";
    await notice.save();
    await createNotification(notice.user, "general", "Your notice was rejected",notice._id);
    res.json({ message: "Notice rejected successfully", notice });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a single notice by ID
// Get a single notice by ID
router.get("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid notice ID format" });
    }

    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.status(200).json(notice);
  } catch (err) {
    console.error("Error fetching notice:", err);
    res.status(500).json({ message: "Server error while fetching notice" });
  }
});

//  Update a notice (admin only)
router.patch("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { title, message, category } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden. Admin only." });
    }

    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    if (title) notice.title = title;
    if (message) notice.message = message;
    if (category) notice.category = category;

    const updated = await notice.save();
    res.json(updated);
  } catch (err) {
    console.error("Error updating notice:", err);
    res.status(500).json({ message: "Server error while updating notice" });
  }
});

module.exports = router;
