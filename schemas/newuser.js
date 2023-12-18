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
    password: {
      type: "string",
      minLength: 8,
      maxLength: 15,
    },
    companyId: {
      type: "number",
    },
    labId: {
      type: "number",
    },
    calibmaster_client_id: {
      type: "number",
    },
  },
  required: ["name", "email", "password", "companyId", "labId", "calibmaster_client_id"],
  additionalProperties: true,
};

module.exports = ajvInstance.compile(schema);
