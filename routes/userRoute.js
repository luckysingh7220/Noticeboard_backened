const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/userControllers");
const { verifyToken,isAdmin}=require("../middlewares/isAdmin");

router.get("/", verifyToken, isAdmin, getAllUsers);

module.exports = router;
