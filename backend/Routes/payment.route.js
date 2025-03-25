const express = require("express");
const router = express.Router();

// Let's first verify if verifyJWT is properly imported
const {authenticateToken} = require("../Middlewares/auth.middleware.js");
const { createOrder } = require("../Controller/payment.controller.js");

// Let's try the route without middleware first to isolate the issue
router.post("/",authenticateToken,createOrder);

module.exports = router;
