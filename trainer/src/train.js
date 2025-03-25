const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");

// Load Preprocessed Data
const rawData = JSON.parse(fs.readFileSync("./data/preprocessed.json"));

// Extract Features (X) and Labels (Y)
const features = rawData.map((row) => [
	row.DurationDays,
	row.ComplexityScore,
	row.CourtLevel,
	row.Region,
	row.ClaimAmount,
	row.SettlementAmount,
	row.LegalRepresentation,
	row.EvidenceScore,
	row.SettlementType,
]);

const labels = rawData.map((row) => row.RiskLevel);

// Convert to TensorFlow tensors
const xs = tf.tensor2d(features);
const ys = tf.tensor1d(labels, "int32");

// Define the model
const model = tf.sequential();
model.add(
	tf.layers.dense({
		inputShape: [features[0].length],
		units: 16,
		activation: "relu",
	})
);
model.add(tf.layers.dense({ units: 8, activation: "relu" }));
model.add(tf.layers.dense({ units: 3, activation: "softmax" }));

model.compile({
	optimizer: "adam",
	loss: "sparseCategoricalCrossentropy",
	metrics: ["accuracy"],
});

// Train the model
async function trainModel() {
	await model.fit(xs, ys, {
		epochs: 150,
		batchSize: 10,
		shuffle: true,
	});

	// Save the model
	await model.save("file://./models/legal_model");
	console.log("Model training complete and saved.");
}

trainModel();
