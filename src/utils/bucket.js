const fs = require("fs");
const path = require("path");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({ keyFilename: "google-cloud-key.json" });
const bucket = storage.bucket("bucket-name");

async function uploadFile({ readable, filename = "" }) {
  const blob = bucket.file(filename);
  const writeableStream = blob.createWriteStream();

  return new Promise((res, rej) => {
    readable.pipe(writeableStream);
    writeableStream.on("finish", () => {
      // const [metadata] = blob.getMetadata();
      // res(metadata.mediaLink);
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      res(publicUrl);
    });
    writeableStream.on("error", rej);
  });
}

async function uploadFileLocal({ readable, filename = "" }) {
  const filepath = path.join("volumes", "api", "bucket", filename);
  const writeableStream = fs.createWriteStream(filepath);

  return new Promise((res, rej) => {
    readable.pipe(writeableStream);
    writeableStream.on("finish", () => {
      res(filepath);
    });
    writeableStream.on("error", rej);
  });
}

async function getFile(filename) {
  const [metaData] = await bucket.file(filename).getMetadata();
  return metaData.mediaLink;
}

async function deleteFile(filename) {
  await bucket.file(filename).delete();
  console.log(`gs://${bucketName}/${filename} deleted`);
}
async function deleteFileLocal(filename) {
  return new Promise((res, rej) => {
    fs.unlink(path.join("volumes", "api", "bucket", filename), (err) =>
      err ? rej(err) : res()
    );
  });
}

module.exports = {
  getFile,
  uploadFile,
  deleteFile,
  deleteFileLocal,
  uploadFileLocal
};
