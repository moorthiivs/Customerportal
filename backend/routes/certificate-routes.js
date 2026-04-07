const express = require("express");
const multer = require("multer");

const certificateController = require("../controllers/certificate-controller");
const syncCertificateController = require("../controllers/Sync_certificateController");

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "certificates");
  },
  filename: (req, file, callBack) => {
    callBack(null, `${file.originalname}`);
  },
});
let upload = multer({ storage });

router.post("/upload", upload.single("file"), certificateController.certificateUploadHandler);

router.post("/list", certificateController.listcertificatesHandler);

router.post("/download", certificateController.certificateDownloader);

router.post("/view-master", certificateController.masterCertificateDownloader);

router.post(
  "/postCertificateData",
  syncCertificateController.postCertificateData
);

module.exports = router;
