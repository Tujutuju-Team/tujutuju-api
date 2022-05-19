const bcrypt = require("bcrypt");

function generate(password) {
  const COST = 14;
  return bcrypt.hash(password, COST);
}

function validate(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

module.exports = { generate, validate };
