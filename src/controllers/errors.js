function notFound(req, res) {
  res.json(404, { message: "Not found routes" });
}

function internal(err, req, res, next) {
  res.json(500, { message: "Something went wrong" });
}

module.exports = { internal, notFound };
