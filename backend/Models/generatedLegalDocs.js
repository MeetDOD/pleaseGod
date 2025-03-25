const mongoose = require("mongoose");

const legalDocSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    legal_resources: [String],
    final_recommendation: String,
    step_by_step_guidance: [String]
});

module.exports = mongoose.model(
	"GeneratedLegalDoc",
	legalDocSchema,
	"generatedLegalDocs"
);
