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

async function detailRestaurant(req, res) {
  const id = +req.params.id;

  const result = await Restaurant.findById(id);
  if (!result) {
    return res.status(status.HTTP_STATUS_NOT_FOUND).json({
      error: {
        code: status.HTTP_STATUS_NOT_FOUND,
        message: "Restaurant not found"
      }
    });
  }

  const { avg, ...rest } = result;
  const data = { ...rest, review: { average_rating: +avg } };

  res.json({
    meta: {
      code: status.HTTP_STATUS_OK,
      message: "Success"
    },
    data: data
  });
}

module.exports = {
  index: asyncWrapper(index),
  detailRestaurant: asyncWrapper(detailRestaurant)
};
