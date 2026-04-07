const ajvInstance = require("../utils/ajv-instance");

const schema = {
  type: "object",
  properties: {
    filename: {
      type: "string",
    },
    srfId: {
      type: "number",
    },
    srfNo: {
      type: "string",
    },
    name: {
      type: "string",
    },
    make: {
      type: "string",
    },
    model: {
      type: "string",
    },
    serialno: {
      type: "string",
    },
    idno: {
      type: "string",
    },
  },
  required: [
    "filename",
    "srfId",
    "srfNo",
    "name",
    "make",
    "model",
    "serialno",
    "idno",
  ],
  additionalProperties: true,
};

module.exports = ajvInstance.compile(schema);
