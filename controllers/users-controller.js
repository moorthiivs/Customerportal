const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const { errorHandler } = require("../helpers/error-handler");
const userSchema = require("../schemas/user");
const User = require("../models").User;
const config = require("../utils/config");
const bcrypt = require("bcryptjs");
const newUserSchema = require("../schemas/newuser");
const Lab = require("../models").Lab;
const Op = require("sequelize").Op;

const login = async (req, res, next) => {

  //AJV Validation
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let code = 200;
  const path = "/api/users/login";
  let action = "Log In!!";
  let sessionId;
  const valid = userSchema(req.body);
  let isError = false;

  if (!valid) {
    isError = true;
    code = 400;
    action = "Invalid Request Params!!";
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }

  const { email, password } = req.body;

  console.log(email, password);

  //Checking user in Database
  let existingUser;
  try {
    existingUser = await User.findOne({
      where: { email: email, rstatus: 1 }
    });
  } catch (err) {
    console.log(err);
    isError = true;
    code = 500;
    action = "Internal Server Error!!";
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }

  //If user not exists return Error Response
  if (!existingUser) {
    isError = true;
    code = 401;
    action = "Invalid Credentials!!";
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }

  let isValidPassword;
  existingUser = existingUser.dataValues;

  //Checking Password
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    isError = true;
    code = 500;
    action = "Internal Server Error!!!";
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }

  //If Password Not Matching return Error Response
  if (!isValidPassword) {
    isError = true;
    code = 401;
    action = "Invalid Credentials!!";
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }

  let token;
  let userId = existingUser.id;

  //Creating Token
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        labId: existingUser.labId,
        companyId: existingUser.companyId,
      },
      config.TOKEN_SECRET,
      { expiresIn: "5h" }
    );
  } catch (err) {
    isError = true;
    code = 500;
    action = "Internal Server Error!!";
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }

  //Retuning 200 response
  if (isError == false) {
    sessionId = token.split(".")[2];
    let message = `${ip} ${userId} ${sessionId} ${code} ${path} - ${action}`;
    logger.info(message);

    res.status(code).json({
      status: "SUCCESS",
      code: code,
      data: {
        userId: userId,
        token: token,
        name: existingUser.name,
        email: existingUser.email,
        role: "Client",
        companyId: existingUser.companyId,
        labId: existingUser.labId,
      },
      message: "Login Success!!",
    });
  }
};

const adduser = async (req, res, next) => {

  //AJV Validation
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let code = 200;
  const path = "/api/users/adduser";
  let action = "Adding Client user!!";
  let sessionId = req.sessionId;
  const userId = req.userId;
  const valid = newUserSchema(req.body);
  let isError = false;

  if (!valid) {
    isError = true;
    code = 400;
    action = "Invalid Request Params!!";
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }
  console.log(req.body);

  const { name, email, password, companyId, labId, calibmaster_client_id } = req.body;


  //Checking user in Database
  let existingUser;
  try {
    existingUser = await User.findOne({ where: { email: email } });
  } catch (err) {
    isError = true;
    code = 500;
    action = "Internal Server Error!!";
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }

  //If user exists return Error Response
  if (existingUser) {
    isError = true;
    code = 401;
    action = "User Already Exists!!";
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }

  //Encrypting the password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    isError = true;
    code = 500;
    action = "Internal Server Error!!";
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }

  //Creating User in Database
  try {
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      companyId,
      rstatus: 1,
      labId,
      calibmaster_client_id
    });
    const result = await newUser.save();
    console.log(result);
  } catch (err) {
    isError = true;
    code = 500;
    action = "Internal Server Error!!" + err;
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }
  //Retuning 200 response
  if (isError == false) {
    let message = `${ip} ${userId} ${sessionId} ${code} ${path} - ${action}`;
    logger.info(message);
    res.status(code).json({
      status: "SUCCESS",
      code: code,
      message: "User Added Successfully!!",
    });
  }
};

const deleteuser = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let code = 200;
  const path = "/api/users/deleteuserbyid";
  let action = "Delete User by Id!!";
  let sessionId = req.sessionId;
  let userId = req.userId;
  let isError = false;

  if (!req.body.userId && !req.body.labId) {
    isError = true;
    code = 400;
    action = "Invalid Request Params!!";
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }
  //Checking user in Database
  let existingUser;
  try {
    existingUser = await User.findOne({
      where: { id: req.body.userId, rstatus: 1, labId: req.body.labId },
    });
  } catch (err) {
    isError = true;
    code = 500;
    action = "Internal Server Error!!";
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }
  //If user not exists return Error Response
  if (!existingUser) {
    isError = true;
    code = 401;
    action = "User not Exists!!";
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }

  try {
    existingUser.update({ rstatus: 0 });
  } catch (err) {
    isError = true;
    code = 500;
    action = "Internal Server Error!!" + err;
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }
  let users;
  //Getting All Users
  try {
    users = await User.findAll({
      where: {
        department: { [Op.ne]: "admin" },
        id: { [Op.ne]: existingUser.id },
        rstatus: 1,
        labId: req.body.labId,
      },
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      order: [["id", "ASC"]],
    });
  } catch (err) {
    isError = true;
    code = 500;
    action = "Internal Server Error!!";
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }
  //Retuning 200 response
  if (isError == false) {
    let message = `${ip} ${userId} ${sessionId} ${code} ${path} - ${action}`;
    logger.info(message);
    res.status(code).json({
      status: "SUCCESS",
      code: code,
      data: users,
      message: "User deleted Successfully!!",
    });
  }
};

const fetchClient = async (req, res, next) => {

  const { calibmaster_client_id } = req.params;

  const client = await User.findOne(
    {
      where: { calibmaster_client_id }
    }
  );

  if (!client) {
    const error = new Error("Client Not Exists!!");
    error.code = 401;
    return errorHandler(error, req, res, next);
  }

  return res.status(200).json({
    status: "SUCCESS",
    code: 200,
    client,
    message: "Client User successfully fetched In customer-portal"
  });
};

const resetPassword = async (req, res, next) => {

  const { password, calibmaster_client_id } = req.body;

  if (!password || !calibmaster_client_id) {
    let action = "All fields are required";
    const error = new Error(action);
    error.code = 500;
    return errorHandler(error, req, res, next);
  }

  try {
    const findUser = await User.findOne({
      where: { calibmaster_client_id }
    });

    // Check if user exist on database
    if (!findUser) {
      const error = new Error("User not found");
      error.code = 500;
      return errorHandler(error, req, res, next);
    }

    //Encrypting the password
    let hashedPassword = await bcrypt.hash(password, 12);

    let response = await User.update(
      { password: hashedPassword },
      { where: { calibmaster_client_id: calibmaster_client_id } }
    );

    return res.status(200).json({
      msg: response, message: "Record updated successfully!!!"
    });

  } catch (err) {
    let action = "Something went wrong, please try again";
    const error = new Error(action);
    error.code = 500;
    return errorHandler(error, req, res, next);
  }
}

exports.deleteuser = deleteuser;
exports.adduser = adduser;
exports.login = login;
exports.fetchClient = fetchClient;
exports.resetPassword = resetPassword;