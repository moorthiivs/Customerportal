const logger = require("../utils/logger");
const { errorHandler } = require("../helpers/error-handler");
const newLabSchema = require("../schemas/lab");
const Lab = require("../models").Lab;
const User = require("../models").User;
const bcrypt = require("bcryptjs");
var fs = require('fs');

const addlab = async (req, res, next) => {

  let {
    lab_id,
    lab_name,
    calibmaster_lab_id,
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

    created_by_login_name,
    created_by_user_id,

    adminName,
    adminEmail,
    adminPassword,

    MainLogo,
    secondLogo,
    thirdLogo,

    sealLogo
  } = req.body;

  email_smtp_server_port = email_smtp_server_port || null;

  //Checking lab in Database
  let existingLab;
  try {
    existingLab = await Lab.findOne({ where: { contact_email, rstatus: 1 } });
  } catch (err) {
    console.log(err);
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
      lab_id,
      lab_name: lab_name,
      calibmaster_lab_id,
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
      rstatus: 1,

      email_smtp_server_host,
      email_smtp_server_port,
      sender_email,
      sender_password,

      gst_number,
      lab_active_flag: 1,

      brand_logo_filename: mainLogoImgFileName,
      brand_logo_mime_type: brand_logo_mime_type,
      brand_logo: buff1,

      other_logo1_image_filename: "--",
      other_logo1_image_mime_type: "--",
      other_logo1_image: buff1,

      other_logo2_image_filename: "--",
      other_logo2_image_mime_type: "--",
      other_logo2_image: buff1,

      created_timestamp: Date.now(),
      created_by_login_name,
      created_by_user_id,

      updated_timestamp: Date.now(),
      effective_start_date: Date.now() + 1000 * 60 * 60 * 24 * 364 * 3000,
      effective_end_date: Date.now() + 1000 * 60 * 60 * 24 * 364 * 3000,

    });
    const result = await newLab.save();
    // console.log(result);

    //Retuning 200 response
    return res.status(201).json({
      status: "SUCCESS",
      code: 201,
      message: "Lab Added Successfully In Customer Portal"
    });

  } catch (err) {
    console.log(err);
    // const error = new Error("Internal Server Error!!");
    // error.code = 500;
    // return errorHandler(error, req, res, next);
  }
};

const updatelab = async (req, res, next) => {

  let {
    labId,
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
    lab_active_flag,

    brand_logo_mime_type,
    brand_logo,

    MainLogo,
    updated_by_login_name,
    updated_by_user_id,
  } = req.body;

  // *** checking non required for values ***
  address2 = (address2 != "") ? address2 : null;
  address3 = (address3 != "") ? address3 : null;
  symbol = (symbol) ? symbol : null;
  email_smtp_server_host = (email_smtp_server_host != "") ? email_smtp_server_host : null;
  email_smtp_server_port = (email_smtp_server_port != "") ? email_smtp_server_port : null;
  sender_email = (sender_email != "") ? sender_email : null;
  sender_password = (sender_password != "") ? sender_password : null;

  //Checking lab in Database
  let existingLab;
  try {
    existingLab = await Lab.findOne({ where: { lab_id: labId, rstatus: 1 } });
  } catch (err) {
    console.log(err);
    const error = new Error("Internal Server Error!!");
    error.code = 500;
    return errorHandler(error, req, res, next);
  }

  //If lab exists return Error Response
  if (!existingLab) {
    action = "Lab Not Exist!!";
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
    mainLogoImgFileName = existingLab.brand_logo_filename;
  }

  // *** Creating Lab ***
  try {
    // update the rows
    await Lab.update(
      {
        lab_name: lab_name ? lab_name : existingLab.lab_name,

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
        lab_active_flag: lab_active_flag ? 1 : 0,

        brand_logo_filename: mainLogoImgFileName,
        brand_logo_mime_type,
        brand_logo: buff1,

        updated_timestamp: Date.now(),
        updated_by_login_name,
        updated_by_user_id
      },
      { where: { lab_id: labId } }
    );

    //Retuning 200 response
    return res.status(201).json({
      status: "SUCCESS",
      code: 201,
      message: "Lab Updated Successfully In Customer Portal"
    });

  } catch (err) {
    console.log(err);
    const error = new Error("Internal Server Error!!");
    error.code = 500;
    return errorHandler(error, req, res, next);
  }
};

const fetchLab = async (req, res, next) => {

  const { calibmaster_lab_id } = req.params

  const customerLab = await Lab.findOne(
    {
      attributes: { exclude: ['brand_logo', 'other_logo1_image', 'other_logo2_image'] },
      where: {
        calibmaster_lab_id
      }
    }
  );

  if (!customerLab) {
    const error = new Error("Customer Lab Not Exists!!");
    error.code = 401;
    return errorHandler(error, req, res, next);
  }

  return res.status(200).json({
    status: "SUCCESS",
    code: 200,
    customerLab,
    message: "Customer lab successfully fetched In customer-portal"
  });
};

exports.addlab = addlab;
exports.updatelab = updatelab;
exports.fetchLab = fetchLab;
