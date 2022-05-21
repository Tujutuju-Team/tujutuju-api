const { constants: status } = require("http2");
const { asyncWrapper, pagination } = require("../utils");
const { Place } = require("../repository");

async function index(req, res) {
  const limit = +req.query.limit || 10;
  const page = +req.query.page || 1;

  const { data, totalData, totalPage, nextUrl, prevUrl } =
    await pagination.getData(limit, page, Place);

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
    data: data
  });
}

module.exports = {
  index: asyncWrapper(index)
};
