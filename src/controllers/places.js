const { constants: status } = require("http2");
const { asyncWrapper, pagination } = require("../utils");
const { Place } = require("../repository");

async function index(req, res) {
  const { PROTOCOL, DOMAIN } = process.env;
  const url = PROTOCOL + DOMAIN + req.path;
  const limit = +req.query.limit || 10;
  const page = +req.query.page || 1;

  const result = await pagination.getData(url, limit, page, Place);

  res.json({
    meta: {
      code: status.HTTP_STATUS_OK,
      message: "Mantapp"
    },
    pagination: {
      total_data: result.totalData,
      total_page: result.totalPage,
      next_page: result.nextUrl,
      prev_page: result.prevUrl
    },
    data: result.data
  });
}

async function detailPlace(req, res) {
  const id = +req.params.id;

  const result = await Place.findById(id);
  if (!result) {
    return res.status(status.HTTP_STATUS_NOT_FOUND).json({
      error: {
        code: status.HTTP_STATUS_NOT_FOUND,
        message: "Place not found"
      }
    });
  }

  res.json({
    meta: {
      code: status.HTTP_STATUS_OK,
      message: "Success"
    },
    data: result
  });
}

module.exports = {
  index: asyncWrapper(index),
  detailPlace: asyncWrapper(detailPlace)
};
