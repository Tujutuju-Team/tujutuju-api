const fs = require("fs");
const path = require("path");
const { constants: status } = require("http2");
const { User } = require("../repository");
const { asyncWrapper, hash, bucket } = require("../utils");

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

async function uploadAvatar(req, res) {
  const file = fs.createReadStream(req.file.path);
  const filename = path.basename(req.file.path);
  const uploadFile =
    process.env.NODE_ENV === "production"
      ? bucket.uploadFile
      : bucket.uploadFileLocal;
  const deleteFile =
    process.env.NODE_ENV === "production"
      ? bucket.deleteFile
      : bucket.deleteFileLocal;
  let uploadedLink = "";

  const userEmail = req.user.sub;
  const user = await User.findById(userEmail);
  if (!user) {
    return res.status(status.HTTP_STATUS_NOT_FOUND).json({
      error: {
        code: status.HTTP_STATUS_NOT_FOUND,
        message: "User not found"
      }
    });
  }

  try {
    uploadedLink = uploadFile(file, filename);
  } catch (error) {
    return res.status(status.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      error: {
        code: status.HTTP_STATUS_INTERNAL_SERVER_ERROR,
        message: "Failed uploading avatar"
      }
    });
  }

  // update avatar to refer cloud storage bucket file
  const updatedUser = new User({ ...user, avatar: uploadedLink });
  await updatedUser.update();

  // delete existing avatar if exists (async)
  user.avatar && deleteFile(user.avatar);

  res.json({
    meta: {
      code: status.HTTP_STATUS_OK,
      message: "Successfully uploaded avatar"
    }
  });
}

module.exports = {
  me: asyncWrapper(me),
  changePassword: asyncWrapper(changePassword),
  uploadAvatar: asyncWrapper(uploadAvatar)
};
