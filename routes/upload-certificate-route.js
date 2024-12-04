const express = require("express");
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const ensureDirectoryExistence = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const certPath = path.join(__dirname, '../certificates');
const masterCertPath = path.join(__dirname, '../mastercertificates');

ensureDirectoryExistence(certPath);
ensureDirectoryExistence(masterCertPath);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'file') {
            cb(null, certPath);
        } else if (file.fieldname === 'masterfile') {
            cb(null, masterCertPath);
        } else {
            cb(new Error('Invalid field name'));
        }
    },
    filename: function (req, file, cb) {
        if (file.fieldname === 'file') {
            cb(null, file.originalname);
        } else if (file.fieldname === 'masterfile') {
            cb(null, file.originalname);
        } else {
            cb(new Error('Invalid field name'));
        }
    },
});

const upload = multer({ storage: storage });

const uploadCertificateController = require("../controllers/upload-certificate-controller");

const router = express.Router();

router.post("/create", upload.fields([{ name: 'file' }, { name: 'masterfile' }]), uploadCertificateController.create);

module.exports = router;
