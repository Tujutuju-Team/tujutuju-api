const express = require("express");
const { body } = require("express-validator");
const controllers = require("../controllers");
const { validation, isAuth } = require("../middlewares");

const Router = express.Router();

Router.use(express.json());

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

Router.get("/me", isAuth, controllers.users.me);

Router.get("/foods", controllers.foods.index);

Router.use(controllers.errors.notFound);
Router.use(controllers.errors.internal);

module.exports = Router;
