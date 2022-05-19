"use strict";

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
      phone: { type: "string" },
      profile_picture: { type: "string" }
    });
  }
  async function createPlaceTable() {
    return db.createTable("places", {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      name: { type: "string", notNull: true },
      address: { type: "string", notNull: true },
      description: { type: "string", notNull: true }
    });
  }
  async function createRestaurantTable() {
    return db.createTable("restaurants", {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      name: { type: "string", notNull: true },
      address: { type: "string", notNull: true },
      email: { type: "string" },
      phone: { type: "string" }
    });
  }
  async function createFoodTable() {
    return db.createTable("foods", {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      name: { type: "string", notNull: true },
      description: { type: "string", notNull: true }
    });
  }
  async function createPlaceReviewTable() {
    return db.createTable("place_reviews", {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      rating: { type: "int", notNull: true },
      description: { type: "string" },
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
      description: { type: "string" },
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
  async function createMenuTable() {
    return db.createTable("menus", {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      description: { type: "string" },
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
    let user = db.insert(
      "users",
      ["email", "password", "name"],
      ["superman@mail.com", "12345678", "Richard Marcolo"]
    );
    let food = db.insert(
      "foods",
      ["name", "description"],
      ["Rawon", "Rawon adalah masakan khas Surabaya."]
    );
    let restaurant = db.insert(
      "restaurants",
      ["name", "address", "email", "phone"],
      ["Kedai Super Enak", "123 Main St", "superenak@mail.com", "1234567890"]
    );
    let place = db.insert(
      "places",
      ["name", "address", "description"],
      ["Pantai Kuta", "123 Main St", "Pantai pasir yang keren di Bali"]
    );

    const promises = [];
    promises.push(user, food, place, restaurant);
    return Promise.all(promises);
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
