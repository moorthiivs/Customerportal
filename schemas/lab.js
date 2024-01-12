const ajvInstance = require("../utils/ajv-instance");

const schema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 3,
    },
    email: {
      type: "string",
      format: "email",
    },
    address1: {
      type: "string",
    },
    address2: {
      type: "string",
    },
    address3: {
      type: "string",
    },
    contactNumber: {
      type: "string",
    },
    symbol: {
      type: "string",
    },
    limageName: {
      type: "string",
    },
    limageType: {
      type: "string",
    },
    limageData: {
      type: "string",
    },
    limageSize: {
      type: "number",
    },
  },
  required: [
    "name",
    "email",
    "address1",
    "address2",
    "address3",
    "contactNumber",
    "symbol",
    "limageName",
    "limageType",
    "limageData",
    "limageSize",
  ],
  additionalProperties: true,
};

module.exports = ajvInstance.compile(schema);
