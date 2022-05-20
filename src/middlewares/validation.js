const { constants: status } = require("http2");
const { validationResult } = require("express-validator");

function isValid(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.HTTP_BAD_REQUEST).json({
      error: {
        code: status.HTTP_BAD_REQUEST,
        message: "Invalid request",
        errors: errors.array().map((err) => err.msg)
      }
    });
  }

  next();
}

module.exports = { isValid };
