const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const Notice = require("../models/Notice");

// Route: GET /api/users/me/notices
router.get("/me/notices", isAuthenticated, async (req, res) => {
  try {
    const myNotices = await Notice.find({ user: req.user._id })
      .sort({ approved: 1, createdAt: -1 }); // Unapproved first

    res.json(myNotices);
  } catch (err) {
    console.error("Error fetching user's notices:", err);
    res.status(500).json({ message: "Failed to fetch your notices" });
  }
});
module.exports = router;
