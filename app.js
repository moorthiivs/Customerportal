const express = require("express");
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/users-routes");
const heartbeatRoute = require("./routes/heartbeat-route");
const labRoutes = require("./routes/lab-routes");
const companyRoutes = require("./routes/company-routes");
const certificateRoutes = require("./routes/certificate-routes");
const calibrationRoutes = require("./routes/calibration-route");
const uploadCertificateRoutes = require("./routes/upload-certificate-route");
const testRoutes = require("./routes/test-routes");

var cors = require("cors");
const logger = require("./utils/logger");
const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/users", usersRoutes);
app.use("/api/heartbeat", heartbeatRoute);
app.use("/api/lab", labRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/certificate", certificateRoutes);
app.use("/api/calibration", calibrationRoutes);
app.use("/api/upload", uploadCertificateRoutes);
app.use("/api/test", testRoutes);

app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

//Default Error Handler
app.use((error, req, res, next) => {
  //console.log("error occured", error);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userId = req.userId;
  const sessionId = req.sessionId;
  const code = error.code;
  const path = error.path;
  const action = error.message;
  let message = `${ip} ${userId} ${sessionId} ${code} ${path} - ${action}`;
  // logger.error(message);
  res.status(error.code).json({
    status: "FAILURE",
    message: error.message,
    code: error.code,
  });
});

//Port on which the server will be exposed
const PORT = process.env.PORT || 5001;

app.listen(PORT);
// logger.info("app is running");