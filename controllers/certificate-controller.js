const logger = require("../utils/logger");
const Certificate = require("../models").Certificate;
const path = require("path");
const { errorHandler } = require("../helpers/error-handler");
var fs = require("fs");

const certificateUploadHandler = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let code = 200;
  const path = "/api/certificate/upload";
  let action = "Upload Certificate";
  let message = `${ip} ${code} ${path} - ${action}`;
  const file = req.file;
  const folderName1DirUp = "./certificates";

  const item = JSON.parse(req?.body?.item);
  // return res.json(item);

  try {
    if (!fs.existsSync(folderName1DirUp)) {
      fs.mkdirSync(folderName1DirUp);
    }
  } catch (err) {
    console.error(err);
  }
  fs.rename(
    folderName1DirUp + "/" + file.originalname,
    folderName1DirUp + "/" + req.body.filename,
    function (err) {
      if (err) console.log("ERROR: " + err);
    }
  );

  if (!file) {
    const code = 400;
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }

  if (file.mimetype !== "application/pdf") {
    const code = 400;

    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }

  try {
    const newCertificate = new Certificate({
      filename: req.body.filename,

      srfId: item?.srf_id,
      srfNo: req.body.srf_number,

      name: item?.intrument_type?.instrument_full_name,
      make: item?.make,
      model: item?.model,
      serialno: item?.serial_no,

      idno: item.identification_details,
      rstatus: 1,

      companyId: req.body.companyId,
    });
    const result = await newCertificate.save();
    return res.json(result);

  } catch (err) {
    console.log(err);
    code = 500;
    action = "Internal Server Error!!!" + err;
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }

  return res.status(200).json({
    status: "SUCCESS",
    message: "File Uploaded Successfully In Customer Portal",
    code: 200,
  });
};

const listcertificatesHandler = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let code = 200;
  const path = "/api/certificate/list";
  let action = "Get Certificates List";

  let message = `${ip} ${code} ${path} - ${action}`;
  //console.log(req.body);
  const { companyId, labId } = req.body;
  //Checking user in Database
  let certificates;
  try {
    certificates = await Certificate.findAll({
      where: { companyId: companyId },
    });
  } catch (err) {
    isError = true;
    code = 500;
    action = "Internal Server Error!!" + err;
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }
  logger.info(message);
  res.status(200).json({
    status: "SUCCESS",
    message: "File Uploaded Successfully!!",
    code: 200,
    data: certificates,
  });
};

const certificateDownloader = async (req, res, next) => {
  let isError = false;
  const documentName = req.body.fileName;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userId = req.userId;
  const sessionId = req.sessionId;
  let code = 200;
  const apipath = "/api/certificate/download";
  let action = "Get Document " + documentName;

  if (isError == false) {
    let message = `${ip} ${userId} ${sessionId} ${code} ${apipath} - ${action}`;
    logger.info(message);
    const docPath = path.join(__dirname, "..", "certificates", documentName);

    res.sendFile(docPath);
  }
};

const masterCertificateDownloader = async (req, res, next) => {
  let isError = false;
  const documentName = req.body.fileName;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userId = req.userId;
  const sessionId = req.sessionId;
  let code = 200;
  const apipath = "/api/mastercertificate/download";
  let action = "Get Document " + documentName;

  if (isError == false) {
    let message = `${ip} ${userId} ${sessionId} ${code} ${apipath} - ${action}`;
    logger.info(message);
    const docPath = path.join(__dirname, "..", "mastercertificates", documentName);
    res.sendFile(docPath);
  }
};

exports.certificateUploadHandler = certificateUploadHandler;
exports.listcertificatesHandler = listcertificatesHandler;
exports.certificateDownloader = certificateDownloader;
exports.masterCertificateDownloader = masterCertificateDownloader
