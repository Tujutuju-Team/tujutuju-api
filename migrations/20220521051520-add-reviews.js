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
  async function seedDB() {
    const placeReviews = [];
    const restaurantReviews = [];

    // random number function
    function randomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    for (let i = 1; i <= 100; i++) {
      placeReviews.push(
        db.insert(
          "place_reviews",
          ["rating", "description", "user_id", "place_id"],
          [randomNumber(1, 5), "Wow", randomNumber(1, 20), randomNumber(1, 20)]
        )
      );
      restaurantReviews.push(
        db.insert(
          "restaurant_reviews",
          ["rating", "description", "user_id", "restaurant_id"],
          [randomNumber(1, 5), "Wow", randomNumber(1, 20), randomNumber(1, 20)]
        )
      );
    }
    return Promise.all([...placeReviews, ...restaurantReviews]);
  }

  return seedDB();
};

exports.down = function (db) {
  return new Promise((res) => res());
};

exports._meta = {
  version: 1
};
