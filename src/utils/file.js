const fs = require("fs");

async function isPathExists(path) {
  return new Promise((res) => {
    fs.access(path, fs.F_OK, (err) => res(err ? false : true));
  });
}

async function deleteFile(path) {
  return new Promise((res, rej) => {
    fs.unlink(path, (err) => {
      err ? rej(err) : res();
    });
  });
}

module.exports = { isPathExists, deleteFile };
