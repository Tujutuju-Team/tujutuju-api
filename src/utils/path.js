const { dirname } = require("path");
const APP_DIR = dirname(require.main.filename);

module.exports = { APP_DIR };
