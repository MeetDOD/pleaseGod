const tf = require("@tensorflow/tfjs-node");

// Load trained model
async function loadModel() {
	return await tf.loadLayersModel("file://./models/legal_model/model.json");
}

// Function to predict risk level
async function predictRisk(newCase) {
	const model = await loadModel();

	const inputTensor = tf.tensor2d([
		[
			newCase.DurationDays,
			newCase.ComplexityScore,
			newCase.CourtLevel,
			newCase.Region,
			newCase.ClaimAmount,
			newCase.SettlementAmount,
			newCase.LegalRepresentation,
			newCase.EvidenceScore,
			newCase.SettlementType,
		],
	]);

	const prediction = model.predict(inputTensor);
	const riskLevel = prediction.argMax(1).dataSync()[0];

	console.log(
		`Predicted Risk Level: ${["Low", "Medium", "High"][riskLevel]}`
	);
}

// Test the model with a sample case
predictRisk({
	DurationDays: 90,
	ComplexityScore: 3,
	CourtLevel: 0, // District Court
	Region: 0, // Mumbai
	ClaimAmount: 50000,
	SettlementAmount: 45000,
	LegalRepresentation: 1, // Yes
	EvidenceScore: 4,
	SettlementType: 0, // Settlement
});
