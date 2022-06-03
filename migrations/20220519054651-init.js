"use strict";

const fs = require("fs");
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

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function readFile(path) {
  return new Promise((res, rej) => {
    fs.readFile(path, (err, content) => {
      err ? rej(err) : res(JSON.parse(content).data);
    });
  });
}

exports.up = async function (db) {
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
    const MINIMUM_MASTER_DATA = 20;
    const MINIMUM_RELATION_DATA = 200;

    const [placeSeed, restaurantSeed, foodSeed] = await Promise.all([
      readFile("./data/places.json"),
      readFile("./data/restaurants.json"),
      readFile("./data/foods.json")
    ]);

    const dataSeed = {
      places: placeSeed,
      foods: foodSeed,
      restaurants: restaurantSeed
    };

    const users = [];
    const places = [];
    const restaurants = [];
    const foods = [];
    const placeReviews = [];
    const restaurantReviews = [];

    dataSeed.places.forEach((p) =>
      places.push(
        db.insert(
          "places",
          ["name", "address", "longitude", "latitude", "description", "images"],
          [
            p.name,
            p.address,
            p.longitude,
            p.latitude,
            p.description,
            JSON.stringify(p.images)
          ]
        )
      )
    );

    dataSeed.restaurants.forEach((r) =>
      restaurants.push(
        db.insert(
          "restaurants",
          [
            "name",
            "address",
            "longitude",
            "latitude",
            "email",
            "phone",
            "images"
          ],
          [
            r.name,
            r.address,
            r.longitude,
            r.latitude,
            r.email,
            r.phone,
            JSON.stringify(r.images)
          ]
        )
      )
    );

    dataSeed.foods.forEach((f) =>
      foods.push(
        db.insert(
          "foods",
          ["name", "description", "images"],
          [f.name, f.description, JSON.stringify(f.images)]
        )
      )
    );

    for (let i = 1; i <= MINIMUM_MASTER_DATA; i++) {
      const password = await bcrypt.hash("12345678", 12);
      const squareImg = "https://source.unsplash.com/random/300×300";
      const rectangleImg = "https://source.unsplash.com/random/500×300";

      const insertionUser = db.insert(
        "users",
        ["email", "password", "name", "avatar"],
        [`superman_${i}@mail.com`, password, `Richard Marcolo-${i}`, squareImg]
      );
      const insertionPlace = db.insert(
        "places",
        ["name", "address", "longitude", "latitude", "description", "images"],
        [
          `Pantai Kuta - ${i}`,
          `123_${i} Main St`,
          randomNumber(-180, 180),
          randomNumber(-90, 90),
          "Pantai pasir yang keren di Bali",
          JSON.stringify([rectangleImg, rectangleImg])
        ]
      );
      const insertionFood = db.insert(
        "foods",
        ["name", "description", "images"],
        [
          `Rawon-${i}`,
          "Rawon adalah masakan khas Surabaya.",
          JSON.stringify([rectangleImg, rectangleImg])
        ]
      );
      const insertionRestaurant = db.insert(
        "restaurants",
        [
          "name",
          "address",
          "longitude",
          "latitude",
          "email",
          "phone",
          "images"
        ],
        [
          `Kedai Super Enak - ${i}`,
          "123 Main St",
          randomNumber(-180, 180),
          randomNumber(-90, 90),
          `superenak_${i}@mail.com`,
          "1234567890",
          JSON.stringify([rectangleImg, rectangleImg])
        ]
      );

      users.push(insertionUser);
      places.push(insertionPlace);
      foods.push(insertionFood);
      restaurants.push(insertionRestaurant);
    }

    await Promise.all([users, places, foods, restaurants]);

    for (let i = 1; i <= MINIMUM_RELATION_DATA; i++) {
      const insertionPlaceReview = db.insert(
        "place_reviews",
        ["rating", "description", "user_id", "place_id"],
        [
          randomNumber(1, 5),
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos in, maiores consectetur ex amet sit, nesciunt distinctio fugit fuga exercitationem illum hic harum a esse?",
          randomNumber(1, users.length),
          randomNumber(1, places.length)
        ]
      );
      const insertionRestaurantReview = db.insert(
        "restaurant_reviews",
        ["rating", "description", "user_id", "restaurant_id"],
        [
          randomNumber(1, 5),
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos in, maiores consectetur ex amet sit, nesciunt distinctio fugit fuga exercitationem illum hic harum a esse?",
          randomNumber(1, users.length),
          randomNumber(1, restaurants.length)
        ]
      );

      placeReviews.push(insertionPlaceReview);
      restaurantReviews.push(insertionRestaurantReview);
    }

    await Promise.all([placeReviews, restaurantReviews]);
  }

  try {
    console.log("Creating master table...");
    await Promise.all([
      createUserTable(),
      createPlaceTable(),
      createRestaurantTable(),
      createFoodTable()
    ]);

    console.log("Creating relation (level-1) table...");
    await Promise.all([
      createPlaceReviewTable(),
      createRestaurantReviewTable(),
      createMenuTable()
    ]);

    console.log("Seeding database with initial data...");
    await seedDB();

    console.log("Done 👌!!");
  } catch (err) {
    console.log("Error happened !!");
    console.error(err);
    throw err;
  }
};

exports.down = async function (db) {
  async function dropUserTable() {
    return db.runSql("DROP TABLE IF EXISTS users");
  }
  async function dropPlaceTable() {
    return db.runSql("DROP TABLE IF EXISTS places");
  }
  async function dropRestaurantTable() {
    return db.runSql("DROP TABLE IF EXISTS restaurants");
  }
  async function dropFoodTable() {
    return db.runSql("DROP TABLE IF EXISTS foods");
  }
  async function dropPlaceReviewTable() {
    return db.runSql("DROP TABLE IF EXISTS place_reviews");
  }
  async function dropRestaurantReviewTable() {
    return db.runSql("DROP TABLE IF EXISTS restaurant_reviews");
  }
  async function dropMenuTable() {
    return db.runSql("DROP TABLE IF EXISTS menus");
  }
  try {
    console.log("Dropping (level-1) relation table...");
    await Promise.all([
      dropMenuTable(),
      dropRestaurantReviewTable(),
      dropPlaceReviewTable()
    ]);

    console.log("Dropping master table...");
    await Promise.all([
      dropFoodTable(),
      dropRestaurantTable(),
      dropPlaceTable(),
      dropUserTable()
    ]);

    console.log("Done 👌!!");
  } catch (err) {
    console.log("Error happened !!");
    console.error(err);
    throw err;
  }
};

exports._meta = {
  version: 1
};
