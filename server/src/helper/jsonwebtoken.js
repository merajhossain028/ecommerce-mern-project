const jwt = require("jsonwebtoken");

const createJsonWebToken = (payload, secretKey, expiresIn) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("Payload must be an object!");
  }
  if (typeof secretKey !== "string" || secretKey === "") {
    throw new Error("Secret Key must be a non-empty string!");
  }
  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { createJsonWebToken };
