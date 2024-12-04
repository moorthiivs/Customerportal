const logger = require("../utils/logger");
const { errorHandler } = require("../helpers/error-handler");
const companySchema = require("../schemas/company");
const Company = require("../models").Company;

const newcompanyHandler = async (req, res, next) => {
  //AJV Validation
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let code = 200;
  const path = "/api/company/new";
  let action = "Adding New Company!!";
  let userId = req.userId;
  const sessionId = req.sessionId;
  const valid = companySchema(req.body);
  let isError = false;

  // if (!valid) {
  //   isError = true;
  //   code = 400;
  //   action = "Invalid Request Params!!";
  //   const error = new Error(action);
  //   error.code = code;
  //   error.path = path;
  //   return errorHandler(error, req, res, next);
  // }

  const { calibmaster_customer_id, customer_id } = req.body;

  // create customer object for validation and store in database
  let customerObj = {};

  customerObj.customer_name = req.body.customer.customer_name;
  customerObj.customer_code = req.body.customer.customer_code;
  customerObj.address1 = req.body.customer.address1;
  customerObj.address2 = req.body.customer.address2;
  customerObj.address3 = req.body.customer.address3;
  customerObj.city = req.body.customer.city;
  customerObj.state = req.body.customer.state;
  customerObj.country = req.body.customer.country;
  customerObj.pincode = req.body.customer.pincode;
  customerObj.gst_number = req.body.customer.gst_number;

  // create customer-contact object for validation and store in database
  let customerContactObj = {};

  customerContactObj.contact_title = req.body.customer_contact.contact_title;
  customerContactObj.contact_fullname = req.body.customer_contact.contact_fullname;
  customerContactObj.contact_email = req.body.customer_contact.contact_email;
  customerContactObj.contact_phone_1 = req.body.customer_contact.contact_phone_1;
  customerContactObj.contact_phone_2 = req.body.customer_contact.contact_phone_2;

  customerObj.lab_id = req.body.labId;

  //Checking Company in Database
  let existingCompany;
  try {
    existingCompany = await Company.findOne({
      where: {
        email: customerContactObj.contact_email,
        labId: customerObj.lab_id,
        rstatus: 1
      },
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

  //If company already exists return Error Response
  if (existingCompany) {
    isError = true;
    code = 401;
    action = "Company Already Exists!!";
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }

  try {
    const createdCompany = new Company({
      id: customer_id,
      companyname: customerObj.customer_name,
      email: customerContactObj.contact_email,
      address1: customerObj.address1,
      address2: customerObj.address2,
      address3: customerObj.address3,
      labId: customerObj.lab_id,
      calibmaster_customer_id,
      rstatus: 1,
    });
    const newcompany = await createdCompany.save();

    return res.status(201).json({
      status: "SUCCESS",
      code: 201,
      message: "Company Added Successfully",
    });
  } catch (err) {
    console.log(err);
    isError = true;
    code = 500;
    action = "Internal Server Error!!" + err;
    const error = new Error(action);
    error.code = code;
    error.path = path;
    return errorHandler(error, req, res, next);
  }
};

const fetchCompany = async (req, res, next) => {

  const { calibmaster_customer_id } = req.params

  const customer = await Company.findOne(
    {
      where: {
        calibmaster_customer_id
      }
    }
  );

  if (!customer) {
    const error = new Error("Customer Not Exists!!");
    error.code = 401;
    return errorHandler(error, req, res, next);
  }

  return res.status(200).json({
    status: "SUCCESS",
    code: 200,
    customer,
    message: "Customer successfully fetched In customer-portal"
  });
};

exports.newcompanyHandler = newcompanyHandler;
exports.fetchCompany = fetchCompany;
