const fs = require("fs");
const Papa = require("papaparse");

// Load CSV file
const csvFile = fs.readFileSync("trainer/Settlement.csv", "utf8");

// Convert CSV to JSON
const jsonData = Papa.parse(csvFile, {
	header: true,
	dynamicTyping: true,
}).data;

// Log the parsed data
console.log(jsonData);
