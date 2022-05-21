const { constants: status } = require("http2");
const { PlaceReview } = require("../repository");
const { asyncWrapper, pagination } = require("../utils");

async function place(req, res) {
  const id = +req.params.id;
  const limit = +req.query.limit || 10;
  const page = +req.query.page || 1;

  const pr = new PlaceReview({ placeId: id });
  const result = await pagination.getData(limit, page, pr);
  const data = result.data.map((item) => {
    return {
      id: item.review_id,
      rating: item.rating,
      description: item.description,
      author: {
        id: item.user_id,
        name: item.name,
        profile_picture: item.profile_picture
      }
    };
  });

  return res.json({
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
    data: data
  });
}

module.exports = { place: asyncWrapper(place) };
