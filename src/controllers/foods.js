const { constants: status } = require("http2");
const { Food } = require("../repository");
const { asyncWrapper, pagination } = require("../utils");

async function index(req, res) {
  const limit = +req.query.limit || 10;
  const page = +req.query.page || 1;

  const result = await pagination.getData(limit, page, Food);

  res.json({
    meta: {
      code: status.HTTP_STATUS_OK,
      message: "Success"
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

module.exports = { index: asyncWrapper(index) };
