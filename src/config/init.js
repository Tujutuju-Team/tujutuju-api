const fs = require("fs");
const path = require("path");
const { path: pathUtils } = require("../utils");

async function init() {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === "development") {
    developmentInit();
  }
}

function developmentInit() {
  const localStorage = path.join(
    pathUtils.APP_DIR,
    "..",
    process.env.LOCAL_STORAGE_DIR
  );
  const tempStorage = path.join(
    pathUtils.APP_DIR,
    "..",
    process.env.TEMP_STORAGE
  );
  fs.mkdirSync(localStorage, { recursive: true });
  fs.mkdirSync(tempStorage, { recursive: true });
}

module.exports = { init };
