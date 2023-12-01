const logger = require("../utils/logger");
const { errorHandler } = require("../helpers/error-handler");
const newLabSchema = require("../schemas/lab");
const Lab = require("../models").Lab;
const User = require("../models").User;
const bcrypt = require("bcryptjs");
var fs = require('fs');

const addlab = async (req, res, next) => {

  const {
    lab_name,
    address1,
    address2,
    address3,
    city,
    state,
    country,
    pincode,

    lab_website,
    contact_email,
    contact_number1,
    contact_number2,

    symbol,

    email_smtp_server_host,
    email_smtp_server_port,
    sender_email,
    sender_password,

    gst_number,

    brand_logo_filename,
    brand_logo_mime_type,
    brand_logo,

    other_logo1_image_filename,
    other_logo1_image_mime_type,
    other_logo1_image,

    other_logo2_image_filename,
    other_logo2_image_mime_type,
    other_logo2_image,

    adminName,
    adminEmail,
    adminPassword,

    MainLogo,
    secondLogo,
    thirdLogo
  } = req.body;

  //Checking lab in Database
  let existingLab;
  try {
    existingLab = await Lab.findOne({ where: { email: contact_email, rstatus: 1 } });
  } catch (err) {
    const error = new Error("Internal Server Error!!");
    error.code = 500;
    return errorHandler(error, req, res, next);
  }

  //If lab exists return Error Response
  if (existingLab) {
    action = "Lab Already Exists!!";
    const error = new Error(action);
    error.code = 401;
    return errorHandler(error, req, res, next);
  }

  function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};

    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
  }

  let mainLogoImgFileName;
  let buff1 = "";
  if (MainLogo) {
    buff1 = new Buffer(brand_logo.split(",")[1], "base64");
    const mainLogoDecodeImg = decodeBase64Image(MainLogo);
    const imageBuffer = mainLogoDecodeImg.data;
    const fileExtension = mainLogoDecodeImg.type.slice(6);
    mainLogoImgFileName = Math.floor(Math.random() * 9999999) + "." + fileExtension;

    try {
      fs.writeFileSync("public/images/" + mainLogoImgFileName, imageBuffer, 'utf8');
    }
    catch (err) {
      console.error(err)
    }
  } else {
    mainLogoImgFileName = "";
  }

  // *** Creating Lab ***
  try {
    const newLab = new Lab({
      name: lab_name,
      address1,
      address2,
      address3,
      email: contact_email,
      contactNumber: contact_number1,
      symbol,
      limageName: mainLogoImgFileName,
      limageType: brand_logo_mime_type,
      limageData: buff1,
      rstatus: 1,
    });
    const result = await newLab.save();
    console.log(result);

  } catch (err) {
    console.log(err);
    const error = new Error("Internal Server Error!!");
    error.code = 500;
    return errorHandler(error, req, res, next);
  }

  //Retuning 200 response
  return res.status(201).json({
    status: "SUCCESS",
    code: 201,
    message: "Lab Added Successfully In Customer Portal"
  });
};

exports.addlab = addlab;
