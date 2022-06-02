const { constants: status } = require("http2");
const path = require("path");
const multer = require("multer");
const { nanoid } = require("nanoid/async");
const { path: pathUtils } = require("../utils");

const disk = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const dest = path.join(pathUtils.APP_DIR, "..", process.env.TEMP_STORAGE);
    cb(null, dest);
  },
  filename: async function (_req, file, cb) {
    try {
      const fileName =
        (await nanoid(10)) + "-" + file.originalname.replace(/ /g, "_");
      cb(null, fileName);
    } catch (error) {
      cb(error, false);
    }
  }
});

const fileFilter = (_req, file, cb) => {
  const allowedFile = ["image/png", "image/jpeg", "image/jpg"];
  const isAcceptable = allowedFile.includes(file.mimetype);

  const error = new Error("Invalid file type");
  error.clientMessage = "Only support png, jpeg, jpg";
  error.code = 400;

  isAcceptable ? cb(null, true) : cb(error, false);
};
const MB_PER_BYTE = 1024 * 1024;
const multerInstance = multer({
  storage: disk,
  fileFilter: fileFilter,
  limits: { fileSize: +process.env.MAX_FILE_SIZE_MB * MB_PER_BYTE }
});

function uploadSingleFile(fieldName = "") {
  return function (req, res, next) {
    multerInstance.single(fieldName)(req, res, (error) => {
      if (error) {
        console.error(error);
        return res.status(status.HTTP_STATUS_BAD_REQUEST).send({
          error: {
            code: status.HTTP_STATUS_BAD_REQUEST,
            message: error.message
          }
        });
      }
      next();
    });
  };
}

module.exports = { uploadSingleFile };
