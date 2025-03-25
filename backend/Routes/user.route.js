const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyOTP,
  getalluser,
  getuserbyid,
  getTrialCount,
  getIsPaid,
  updateIsPaid,
} = require("../Controller/user.controller");
const { authenticateToken } = require("../Middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.get("/getalluser", getalluser);
router.get("/me", authenticateToken, getuserbyid);
router.get("/trial-count", authenticateToken, getTrialCount);
router.get("/is-paid", authenticateToken, getIsPaid);
router.put("/update-is-paid", authenticateToken, updateIsPaid);
module.exports = router;
