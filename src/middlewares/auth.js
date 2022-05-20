const { constants: status } = require("http2");
const { jwt, asyncWrapper } = require("../utils");

async function isAuth(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(status.HTTP_STATUS_UNAUTHORIZED).json({
      error: {
        code: status.HTTP_STATUS_UNAUTHORIZED,
        message: "No token provided"
      }
    });
  }

  try {
    const decoded = await jwt.verify(token);
    req.user = decoded;
  } catch (error) {
    return res.status(status.HTTP_STATUS_UNAUTHORIZED).json({
      error: {
        code: status.HTTP_STATUS_UNAUTHORIZED,
        message: "Token is not valid"
      }
    });
  }

  next();
}

module.exports = asyncWrapper(isAuth);
