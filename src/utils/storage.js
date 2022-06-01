const path = require("path");
const { file, io } = require(".");
const { Storage } = require("@google-cloud/storage");

let storage;

function getStorage() {
  if (!storage) {
    const {
      NODE_ENV,
      LOCAL_STORAGE_DIR,
      CLOUD_STORAGE_KEYFILE,
      CLOUD_STORAGE_BUCKET
    } = process.env;

    switch (NODE_ENV) {
      case "production":
        storage = new GoogleCloudStorage(
          CLOUD_STORAGE_KEYFILE,
          CLOUD_STORAGE_BUCKET
        );
        break;

      case "development":
        storage = new LocalStorage(LOCAL_STORAGE_DIR);

      default:
        throw new Error("NODE_ENV is not defined");
    }
  }

  return storage;
}

class LocalStorage {
  constructor(dir) {
    this.dir = dir;
  }

  async save({ readable, filename = "" }) {
    const dest = path.join(this.dir, filename);
    const isExist = await file.isPathExists(dest);
    if (isExist) {
      throw new Error("file already exists");
    }

    await io.copy(readable, fs.createWriteStream(dest));
    return dest;
  }

  async remove(fileName) {
    const dest = path.join(this.dir, fileName);
    await file.deleteFile(dest);
  }
}

class GoogleCloudStorage {
  #storage;
  #bucket;

  constructor(keyFilename, bucketName) {
    this.#storage = new Storage({ keyFilename });
    this.#bucket = this.#storage.bucket(bucketName);
  }

  async save({ readable, filename = "" }) {
    const blob = this.#bucket.file(filename);
    const writeableStream = blob.createWriteStream();

    await io.copy(readable, writeableStream);

    // const [metadata] = blob.getMetadata();
    // return metadata.mediaLink;
    const publicUrl = `${bucket.name}/${blob.name}`;
    return publicUrl;
  }

  async remove(fileName) {
    // source: https://cloud.google.com/storage/docs/samples/storage-delete-file
    await this.#bucket.file(fileName).delete();
    console.log(`gs://${bucketName}/${fileName} deleted`);
  }
}

module.exports = { getStorage };
