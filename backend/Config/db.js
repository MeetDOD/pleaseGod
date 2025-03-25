const mongoose = require("mongoose");
require("dotenv").config();

const db = process.env.MONGO_URL;
console.log(db);
mongoose
    .connect(db)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Failed to connect to MongoDB", err);
    });