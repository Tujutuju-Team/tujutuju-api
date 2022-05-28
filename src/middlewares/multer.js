const multer = require("multer");
const { nanoid } = require("nanoid/async");

const disk = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, process.env.TEMP_STORAGE);
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

const multerInstance = multer({
  storage: disk,
  fileFilter: fileFilter
});

module.exports = { multer: multerInstance };
