const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyOTP,
  getalluser,
  getuserbyid,
} = require("../Controller/user.controller");
const { authenticateToken } = require("../Middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.get("/getalluser", getalluser);
router.get("/me", authenticateToken, getuserbyid);

module.exports = router;
