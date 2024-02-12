const express = require("express");
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../certificates'));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '.pdf';
        cb(null, name);
    }
});

const upload = multer({ storage: storage });

const uploadCertificateController = require("../controllers/upload-certificate-controller");

const router = express.Router();

router.post("/create", upload.single('file'), uploadCertificateController.create);

module.exports = router;
