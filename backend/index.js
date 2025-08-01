const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
require("./Config/db");
const cookieParser = require("cookie-parser");
const userRoute = require("./Routes/user.route");
const fileUpload = require("express-fileupload");
const { cloudnairyconnect } = require("./Config/cloudinary");
require("./jobs/schedular");
const formRoute = require("./Routes/form.route");
const legalDocRoute = require('./Routes/legalDoc.route');
const paymentRouter = require("./Routes/payment.route.js");

const questionRoutes = require("./Routes/community/question.route.js");
const answerRoutes = require("./Routes/community/answer.route.js");
const commentRoutes = require("./Routes/community/comment.route.js");
const voteRoutes = require("./Routes/community/votes.route.js");

const podcastRoutes = require("./Routes/podcast.route.js");

const serpRouter = require("./Routes/serp.route");
const axios = require("axios");
const port = process.env.PORT || 4000;

app.use(cors({ origin: "*" }));
app.use(cookieParser());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(fileUpload({ useTempFiles: true }));
app.use(express.static(path.join(__dirname, "deployments")));

cloudnairyconnect();

app.use("/api/user", userRoute);
app.use("/api/form", formRoute);
app.use('/api/legal', legalDocRoute);
app.use('/api/payment', paymentRouter);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/vote", voteRoutes);
app.use("/api/podcast", podcastRoutes);
app.use('/api/serp', serpRouter);

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

app.post("/api/directions", async (req, res) => {
  const { origin, destination, travelMode } = req.body;
  console.log("Received request for directions:");
  console.log("Origin:", origin);
  console.log("Destination:", destination);
  console.log("Travel Mode:", travelMode);

  try {
    const googleMapsUrl = `https://routes.googleapis.com/directions/v2:computeRoutes`;
    // Build the request body using coordinates and travelMode from the payload.
    const requestBody = {
      origin: {
        address: origin.address
      },
      destination: {
        address: destination.address
      },
      travelMode: travelMode || "DRIVE"
    };
    console.log("Request Body:", requestBody);

    const response = await axios.post(googleMapsUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline'
      }
    });

    console.log("Response from Google Maps API:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching directions:", error.message);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }
    res.status(500).json({ error: "Failed to fetch directions" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
