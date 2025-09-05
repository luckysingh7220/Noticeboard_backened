const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/authRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const user = require("./routes/user"); 
const userRoutes=require("./routes/userRoute");
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/user", user); 
app.use("/api/users",userRoutes);
app.use("/api/notifications", notificationRoutes);
module.exports = app;
