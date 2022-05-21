const express = require("express");
const { body, query, param } = require("express-validator");
const controllers = require("../controllers");
const { validation, auth } = require("../middlewares");

const Router = express.Router();

Router.use(express.json());

Router.get("/me", auth.isAuth, controllers.users.me);

Router.post(
  "/auth/login",
  body("email", "Invalid email").isEmail(),
  validation.isValid,
  controllers.auth.login
);
Router.post(
  "/auth/register",
  body("name", "Invalid name").isString().notEmpty(),
  body("email", "Invalid email").isEmail(),
  body("password", "Invalid password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password should be minimum 6 characters"),
  validation.isValid,
  controllers.auth.register
);
Router.post(
  "/places/:id/reviews",
  param("id", "Id should be positive integer").isInt({ gt: 0 }),
  body("rating", "Rating should be integer from 1 - 5").isInt({ gt: 0, lt: 6 }),
  body("description", "Invalid description").isString().notEmpty(),
  validation.isValid,
  auth.isAuth,
  controllers.reviews.publishPlaceReview
);
Router.post(
  "/restaurants/:id/reviews",
  param("id", "Id should be positive integer").isInt({ gt: 0 }),
  body("rating", "Rating should be integer from 1 - 5").isInt({ gt: 0, lt: 6 }),
  body("description", "Invalid description").isString().notEmpty(),
  validation.isValid,
  auth.isAuth,
  controllers.reviews.publishRestaurantReview
);

Router.get(
  "/places/:id/reviews",
  param("id", "id should be positive integer").isInt({ gt: 0 }),
  query("limit", "limit should be positive integer")
    .if((value) => value)
    .isInt({ gt: 0 }),
  query("page", "page should be positive integer")
    .if((value) => value)
    .isInt({ gt: 0 }),
  validation.isValid,
  controllers.reviews.place
);
Router.get(
  "/restaurants/:id/reviews",
  param("id", "id should be positive integer").isInt({ gt: 0 }),
  query("limit", "limit should be positive integer")
    .if((value) => value)
    .isInt({ gt: 0 }),
  query("page", "page should be positive integer")
    .if((value) => value)
    .isInt({ gt: 0 }),
  validation.isValid,
  controllers.reviews.restaurant
);

Router.get(
  "/places",
  query("limit", "limit should be positive integer")
    .if((value) => value)
    .isInt({ gt: 0 }),
  query("page", "page should be positive integer")
    .if((value) => value)
    .isInt({ gt: 0 }),
  validation.isValid,
  controllers.places.index
);
Router.get(
  "/restaurants",
  query("limit", "limit should be positive integer")
    .if((value) => value)
    .isInt({ gt: 0 }),
  query("page", "page should be positive integer")
    .if((value) => value)
    .isInt({ gt: 0 }),
  validation.isValid,
  controllers.restaurants.index
);
Router.get(
  "/foods",
  query("limit", "limit should be positive integer")
    .if((value) => value)
    .isInt({ gt: 0 }),
  query("page", "page should be positive integer")
    .if((value) => value)
    .isInt({ gt: 0 }),
  controllers.foods.index
);

Router.use(controllers.errors.notFound);
Router.use(controllers.errors.internal);

module.exports = Router;
