const { asyncWrapper, hash, jwt } = require("../utils");

async function register(req, res) {
  // TODO: ada middleware validasi

  const { email, password, name } = req.body;

  // TODO: check di databae email sudah ada atau belum

  const hashedPassword = await hash.generate(password);

  // TODO: save account to database

  res.json({
    meta: {
      code: 200,
      message: "Register account success"
    }
  });
}

async function login(req, res) {
  // TODO: ada middleware validasi

  const { email, password } = req.body;

  // TODO: check database ada atau ngga akunnya
  let hashPassword = "";

  // TODO: compare password
  const doesMatch = await hash.validate(password, hashPassword);
  if (doesMatch === false) {
    return res.json({
      error: {
        code: 401,
        message: "Wrong email or password"
      }
    });
  }

  const token = await jwt.generate({ jti: "123", sub: email });
  res.json({
    meta: {
      code: 200,
      message: "Login success"
    },
    data: {
      token: token
    }
  });
}

module.exports = {
  register: asyncWrapper(register),
  login: asyncWrapper(login)
};
