const { constants: status } = require("http2");
const {
  User,
  Place,
  Restaurant,
  PlaceReview,
  RestaurantReview
} = require("../repository");
const { asyncWrapper, pagination } = require("../utils");

async function place(req, res) {
  const id = +req.params.id;
  const limit = +req.query.limit || 10;
  const page = +req.query.page || 1;
  const url = process.env.DOMAIN + req.path;

  const pr = new PlaceReview({ placeId: id });
  const result = await pagination.getData(url, limit, page, pr);

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
    data: result.data
  });
}

async function restaurant(req, res) {
  const id = +req.params.id;
  const limit = +req.query.limit || 10;
  const page = +req.query.page || 1;
  const url = process.env.DOMAIN + req.path;

  const rr = new RestaurantReview({ restaurantId: id });
  const result = await pagination.getData(url, limit, page, rr);

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
    data: result.data
  });
}

async function publishPlaceReview(req, res) {
  const id = +req.params.id;
  const { rating, description } = req.body;
  const userEmail = req.user.sub;

  // check if place destination exists
  const destination = await Place.findById(id);
  if (!destination) {
    return res.status(status.HTTP_STATUS_NOT_FOUND).json({
      meta: {
        code: status.HTTP_STATUS_NOT_FOUND,
        message: "Place is not found"
      }
    });
  }

  const user = await User.findByEmail(userEmail);
  if (!user) {
    return res.status(status.HTTP_STATUS_NOT_FOUND).json({
      meta: {
        code: status.HTTP_STATUS_NOT_FOUND,
        message: "User is not found"
      }
    });
  }

  const review = new PlaceReview({
    placeId: destination.id,
    userId: user.id,
    rating,
    description
  });

  console.log("REVIEW", review);
  await review.create();

  return res.json({
    meta: {
      code: status.HTTP_STATUS_OK,
      message: "Review published"
    }
  });
}
async function publishRestaurantReview(req, res) {
  const id = +req.params.id;
  const { rating, description } = req.body;
  const userEmail = req.user.sub;

  // check if restaurant destination exists
  const resto = await Restaurant.findById(id);
  if (!resto) {
    return res.status(status.HTTP_STATUS_NOT_FOUND).json({
      meta: {
        code: status.HTTP_STATUS_NOT_FOUND,
        message: "Restaurant is not found"
      }
    });
  }

  const user = await User.findByEmail(userEmail);
  if (!user) {
    return res.status(status.HTTP_STATUS_NOT_FOUND).json({
      meta: {
        code: status.HTTP_STATUS_NOT_FOUND,
        message: "User is not found"
      }
    });
  }

  const review = new RestaurantReview({
    userId: user.id,
    restaurantId: resto.id,
    rating,
    description
  });

  await review.create();

  return res.json({
    meta: {
      code: status.HTTP_STATUS_OK,
      message: "Review published"
    },
    data: result
  });
}

module.exports = {
  place: asyncWrapper(place),
  restaurant: asyncWrapper(restaurant),
  publishPlaceReview: asyncWrapper(publishPlaceReview),
  publishRestaurantReview: asyncWrapper(publishRestaurantReview)
};
