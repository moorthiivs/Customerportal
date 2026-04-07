const ajvInstance = require("../utils/ajv-instance");

const schema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
      minLength: 8,
      maxLength: 15,
    },
  },
  required: ["email", "password"],
  additionalProperties: true,
};

module.exports = ajvInstance.compile(schema);
