const jwt = require("jsonwebtoken");

const standardPayload = {
  iss: "",
  sub: "",
  exp: "",
  iat: "",
  jti: ""
};

function generate(payload = standardPayload) {
  return new Promise((res, rej) => {
    const secret = process.env.JWT_SECRET;
    jwt.sign(payload, secret, (err, token) => (err ? rej(err) : res(token)));
  });
}

function verify(token) {
  return new Promise((res, rej) => {
    const secret = process.env.JWT_SECRET;
    jwt.verify(token, secret, (err, decoded) =>
      err ? rej(err) : res(decoded)
    );
  });
}

module.exports = { generate, verify };
