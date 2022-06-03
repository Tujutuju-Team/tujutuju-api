"use strict";

const bcrypt = require("bcrypt");

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  async function createUserTable() {
    return db.createTable("users", {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      email: { type: "string", notNull: true, unique: true },
      password: { type: "string", notNull: true },
      name: { type: "string", notNull: true },
      phone: { type: "string", defaultValue: "" },
      avatar: { type: "text", defaultValue: "" }
    });
  }
  async function createPlaceTable() {
    return db.createTable("places", {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      name: { type: "string", notNull: true },
      address: { type: "text", notNull: true },
      longitude: { type: "decimal", notNull: true },
      latitude: { type: "decimal", notNull: true },
      description: { type: "text", notNull: true },
      images: { type: "json", defaultValue: "[]" }
    });
  }
  async function createRestaurantTable() {
    return db.createTable("restaurants", {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      name: { type: "string", notNull: true },
      email: { type: "string", defaultValue: "" },
      phone: { type: "string", defaultValue: "" },
      description: { type: "text", defaultValue: "" },
      longitude: { type: "decimal", notNull: true },
      latitude: { type: "decimal", notNull: true },
      address: { type: "text", notNull: true },
      images: { type: "json", defaultValue: "[]" }
    });
  }
  async function createFoodTable() {
    return db.createTable("foods", {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      name: { type: "string", notNull: true },
      description: { type: "text", notNull: true },
      images: { type: "json", defaultValue: "[]" }
    });
  }
  async function createPlaceReviewTable() {
    return db.createTable("place_reviews", {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      rating: { type: "int", notNull: true },
      description: { type: "text", defaultValue: "" },
      user_id: {
        type: "int",
        notNull: true,
        foreignKey: {
          name: "fk_place_reviews_users",
          table: "users",
          mapping: "id",
          rules: {
            onDelete: "CASCADE",
            onUpdate: "RESTRICT"
          }
        }
      },
      place_id: {
        type: "int",
        notNull: true,
        foreignKey: {
          name: "fk_place_reviews_places",
          table: "places",
          mapping: "id",
          rules: {
            onDelete: "CASCADE",
            onUpdate: "RESTRICT"
          }
        }
      }
    });
  }
  async function createRestaurantReviewTable() {
    return db.createTable("restaurant_reviews", {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      rating: { type: "int", notNull: true },
      description: { type: "text", defaultValue: "" },
      user_id: {
        type: "int",
        notNull: true,
        foreignKey: {
          name: "fk_restaurant_reviews_users",
          table: "users",
          mapping: "id",
          rules: {
            onDelete: "CASCADE",
            onUpdate: "RESTRICT"
          }
        }
      },
      restaurant_id: {
        type: "int",
        notNull: true,
        foreignKey: {
          name: "fk_restaurant_reviews_restaurants",
          table: "restaurants",
          mapping: "id",
          rules: {
            onDelete: "CASCADE",
            onUpdate: "RESTRICT"
          }
        }
      }
    });
  }
  async function createMenuTable() {
    return db.createTable("menus", {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      description: { type: "text", defaultValue: "" },
      price: { type: "decimal", notNull: true },
      food_id: {
        type: "int",
        notNull: true,
        foreignKey: {
          name: "fk_menus_foods",
          table: "foods",
          mapping: "id",
          rules: {
            onDelete: "CASCADE",
            onUpdate: "RESTRICT"
          }
        }
      },
      restaurant_id: {
        type: "int",
        notNull: true,
        foreignKey: {
          name: "fk_menus_restaurants",
          table: "restaurants",
          mapping: "id",
          rules: {
            onDelete: "CASCADE",
            onUpdate: "RESTRICT"
          }
        }
      }
    });
  }
  async function seedDB() {
    const users = [];
    const places = [];
    const restaurants = [];
    const foods = [];

    for (let i = 1; i <= 20; i++) {
      const password = await bcrypt.hash("12345678", 12);
      users.push(
        db.insert(
          "users",
          ["email", "password", "name"],
          [`superman_${i}@mail.com`, password, `Richard Marcolo-${i}`]
        )
      );
      foods.push(
        db.insert(
          "foods",
          ["name", "description", "images"],
          [
            `Rawon-${i}`,
            "Rawon adalah masakan khas Surabaya.",
            `["http://url1.com", "http://url2.com"]`
          ]
        )
      );
      restaurants.push(
        db.insert(
          "restaurants",
          ["name", "address", "longitude", "latitude", "email", "phone"],
          [
            `Kedai Super Enak - ${i}`,
            "123 Main St",
            -6.23,
            -12.23323,
            `superenak_${i}@mail.com`,
            "1234567890"
          ]
        )
      );
      places.push(
        db.insert(
          "places",
          ["name", "address", "longitude", "latitude", "description"],
          [
            `Pantai Kuta - ${i}`,
            `123_${i} Main St`,
            -6.23,
            -12.23323,
            "Pantai pasir yang keren di Bali"
          ]
        )
      );
    }

    return Promise.all([...users, ...foods, ...places, ...restaurants]);
  }

  return createUserTable()
    .then(createPlaceTable)
    .then(createRestaurantTable)
    .then(createFoodTable)
    .then(createPlaceReviewTable)
    .then(createRestaurantReviewTable)
    .then(createMenuTable)
    .then(seedDB)
    .catch((err) => console.error(err));
};

exports.down = function (db) {
  async function dropUserTable() {
    return db.dropTable("users");
  }
  async function dropPlaceTable() {
    return db.dropTable("places");
  }
  async function dropRestaurantTable() {
    return db.dropTable("restaurants");
  }
  async function dropFoodTable() {
    return db.dropTable("foods");
  }
  async function dropPlaceReviewTable() {
    return db.dropTable("place_reviews");
  }
  async function dropRestaurantReviewTable() {
    return db.dropTable("restaurant_reviews");
  }
  async function dropMenuTable() {
    return db.dropTable("menus");
  }

  return dropMenuTable()
    .then(dropRestaurantReviewTable)
    .then(dropPlaceReviewTable)
    .then(dropFoodTable)
    .then(dropRestaurantTable)
    .then(dropPlaceTable)
    .then(dropUserTable)
    .catch((err) => console.error(err));
};

exports._meta = {
  version: 1
};
