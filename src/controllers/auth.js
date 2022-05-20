const { constants: status } = require("http2");
const { nanoid } = require("nanoid/async");
const { asyncWrapper, hash, jwt } = require("../utils");
const { User } = require("../repository");

async function register(req, res) {
  const { email, password, name } = req.body;

  // check di databae email sudah ada atau belum
  const user = await User.findByEmail(email);
  if (user) {
    return res.status(status.HTTP_STATUS_UNPROCESSABLE_ENTITY).json({
      error: {
        code: status.HTTP_STATUS_UNPROCESSABLE_ENTITY,
        message: "Email already exists"
      }
    });
  }

  // save account to database
  const hashedPassword = await hash.generate(password);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.create();

  res.json({
    meta: {
      code: 200,
      message: "Register account success"
    }
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  // check database ada atau ngga akunnya
  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(status.HTTP_STATUS_NOT_FOUND).json({
      error: {
        code: status.HTTP_STATUS_NOT_FOUND,
        message: "User with this email is not found"
      }
    });
  }

  // compare password. if does not match => means wrong password
  const doesMatch = await hash.validate(password, user.password);
  if (!doesMatch) {
    return res.status(status.HTTP_STATUS_UNAUTHORIZED).json({
      error: {
        code: status.HTTP_STATUS_UNAUTHORIZED,
        message: "Wrong email or password"
      }
    });
  }

  // Generate token for the valid user
  const token = await jwt.generate({
    sub: user.email,
    exp: 60 * +process.env.JWT_EXPIRY_MINUTES + Date.now() / 1000,
    jti: await nanoid()
  });

  res.json({
    meta: {
      code: status.HTTP_STATUS_OK,
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
