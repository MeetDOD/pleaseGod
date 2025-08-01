const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../../Middlewares/auth.middleware");
const { createComment, getComments } = require("../../Controller/community/comment.controller");

router.post("/", authenticateToken, createComment); 
router.get("/", getComments); 

module.exports = router;