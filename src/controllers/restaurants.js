const { constants: status } = require("http2");
const { asyncWrapper, pagination } = require("../utils");
const { Restaurant } = require("../repository");

async function index(req, res) {
  const limit = +req.query.limit || 10;
  const page = +req.query.page || 1;
  const url = process.env.DOMAIN + req.path;

  const result = await pagination.getData(url, limit, page, Restaurant);

  const dataFormated = result.data.map((p) => {
    const { avg, ...rest } = p;
    return { ...rest, review: { average_rating: +avg } };
  });

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
    data: dataFormated
  });
}

module.exports = {
  index: asyncWrapper(index)
};
