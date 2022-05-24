const { constants: status } = require("http2");
const { User } = require("../repository");
const { asyncWrapper, hash } = require("../utils");

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

async function changePassword(req, res) {
  const { sub: userEmail } = req.user;
  const { old_password, new_password } = req.body;

  const user = await User.findByEmail(userEmail);
  if (!user) {
    return res
      .status(status.HTTP_STATUS_NOT_FOUND)
      .json({ message: "User not found" });
  }

  const doesMatch = await hash.validate(old_password, user.password);
  if (!doesMatch) {
    return res.status(status.HTTP_STATUS_UNPROCESSABLE_ENTITY).json({
      error: {
        code: status.HTTP_STATUS_UNPROCESSABLE_ENTITY,
        message: "Wrong old password"
      }
    });
  }

  const hashedPassword = await hash.generate(new_password);
  const updatedUser = new User({ ...user, password: hashedPassword });
  await updatedUser.update();

  res.json({
    meta: {
      code: status.HTTP_STATUS_OK,
      message: "Successfully changed password"
    }
  });
}

module.exports = {
  me: asyncWrapper(me),
  changePassword: asyncWrapper(changePassword)
};
