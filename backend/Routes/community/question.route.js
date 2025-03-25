const express = require("express");
const { authenticateToken } = require("../../Middlewares/auth.middleware");
const { createQuestion, getQuestions, getQuestionById, deleteQuestion, acceptAnswer } = require("../../Controller/community/question.controller");
const router = express.Router();

router.post("/", authenticateToken, createQuestion); 
router.get("/", getQuestions);
router.get("/:id", getQuestionById);               
router.delete("/:id", authenticateToken, deleteQuestion); 
router.post("/accept", authenticateToken, acceptAnswer); 

module.exports = router;