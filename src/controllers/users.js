const { constants: status } = require("http2");
const { User } = require("../repository");
const { asyncWrapper } = require("../utils");

async function me(req, res) {
  const { sub: userEmail } = req.user;
  const user = await User.findByEmail(userEmail);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { password, ...userProfileData } = user;
  res.json({
    meta: {
      code: status.HTTP_STATUS_OK,
      message: "Success retrieving user profile"
    },
    data: userProfileData
  });
}

module.exports = { me: asyncWrapper(me) };
