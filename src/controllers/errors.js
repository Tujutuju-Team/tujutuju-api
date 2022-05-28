function notFound(req, res) {
  res.status(404).json({ message: "Not found routes" });
}

function internal(err, req, res, next) {
  console.error(err);
  const message = err.clientMessage || "";
  const code = err.code || 500;
  res.status(code).json({
    error: {
      code: code,
      message: "Internal server error",
      client_message: message
    }
  });
}

module.exports = { internal, notFound };
