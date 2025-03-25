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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
