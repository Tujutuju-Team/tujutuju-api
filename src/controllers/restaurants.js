const { constants: status } = require("http2");
const { asyncWrapper, pagination } = require("../utils");
const { Restaurant } = require("../repository");

async function index(req, res) {
  const limit = +req.query.limit || 10;
  const page = +req.query.page || 1;

  const { data, totalData, totalPage, nextUrl, prevUrl } =
    await pagination.getData(limit, page, Restaurant);

  const dataFormated = data.map((p) => {
    const { avg, ...rest } = p;
    return { ...rest, review: { average_rating: +avg } };
  });

  res.json({
    meta: {
      code: status.HTTP_STATUS_OK,
      message: "Mantapp"
    },
    pagination: {
      total_data: totalData,
      total_page: totalPage,
      next_page: nextUrl,
      prev_page: prevUrl
    },
    data: dataFormated
  });
}

module.exports = {
  index: asyncWrapper(index)
};
