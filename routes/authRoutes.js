const express = require("express");
const router = express.Router();
const {
  registerUser,
  login,
  getProfile,
} = require("../controllers/authController");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/register", registerUser);
router.post("/login", login);
router.get("/me", isAuthenticated, getProfile);
module.exports = router;
