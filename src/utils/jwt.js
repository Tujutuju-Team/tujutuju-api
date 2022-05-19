const jwt = require("jsonwebtoken");

function generate(payload) {
  return new Promise((res, rej) => {
    const secret = process.env.JWT_SECRET;
    jwt.sign(payload, secret, (err, token) => {
      if (err) {
        return rej(err);
      }
      res(token);
    });
  });
}

function verify(token) {
  const secret = process.env.JWT_SECRET;
  return jwt.verify(token, secret);
}

module.exports = { generate, verify };
