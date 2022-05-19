const express = require("express");
const controllers = require("../controllers");

const Router = express.Router();

Router.use(express.json());

Router.get("/auth/login", controllers.auth.login);
Router.get("/auth/register", controllers.auth.register);

Router.get("/users", controllers.users.index);

Router.get("/foods", controllers.foods.index);

Router.use(controllers.errors.notFound);
Router.use(controllers.errors.internal);

module.exports = Router;
