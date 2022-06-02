function copy(readable, writeable) {
  return new Promise((res, rej) => {
    readable.pipe(writeable);
    writeable.on("error", rej);
    writeable.on("finish", res);
  });
}

module.exports = { copy };
