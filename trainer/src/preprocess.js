const fs = require("fs");
const Papa = require("papaparse");

// Read CSV File
const csvFile = fs.readFileSync("./Settlement.csv", "utf8");

// Parse CSV into JSON
const jsonData = Papa.parse(csvFile, { header: true, dynamicTyping: true }).data;

// Convert categorical values into numbers
const encodeCategory = (value, categories) => categories.indexOf(value);

jsonData.forEach((row) => {
  row.CourtLevel = encodeCategory(row.CourtLevel, ["District Court", "High Court"]);
  row.Region = encodeCategory(row.Region, ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune"]);
  row.SettlementType = encodeCategory(row.SettlementType, ["Settlement", "Out-of-Court Settlement", "Judgment"]);
  row.LegalRepresentation = row.LegalRepresentation === "Yes" ? 1 : 0;
  row.RiskLevel = encodeCategory(row.RiskLevel, ["Low", "Medium", "High"]); // Target variable
});

// Save preprocessed data
fs.writeFileSync("./data/preprocessed.json", JSON.stringify(jsonData, null, 2));

console.log("Data Preprocessing Complete.");
