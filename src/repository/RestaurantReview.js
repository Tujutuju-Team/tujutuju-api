const { query } = require("../utils/db");

class RestaurantReview {
  constructor({ userId, restaurantId, rating, description }) {
    this.userId = userId;
    this.restaurantId = restaurantId;
    this.rating = rating;
    this.description = description;
  }

  count = async () => {
    const result = await query(
      "SELECT COUNT(*) FROM restaurant_reviews WHERE restaurant_id = $1",
      [this.restaurantId]
    );
    return +result.rows[0].count;
  };

  find = async ({ limit = 0, offset = 0 }) => {
    if (limit < 0 || offset < 0) {
      throw new Error("Invalid limit or offset");
    }

    const statement = `
      SELECT r.id AS review_id, r.rating, r.description, users.id AS user_id, users.name, users.profile_picture FROM restaurant_reviews AS r 
      JOIN users ON (r.user_id = users.id)
      WHERE r.restaurant_id = $1
      LIMIT $2 
      OFFSET $3
    `;

    const result = await query(statement, [this.restaurantId, limit, offset]);
    return result.rows;
  };

  create = async () => {
    const statement = `
      INSERT INTO restaurant_reviews (user_id, restaurant_id, rating, description)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

    return query(statement, [
      this.userId,
      this.restaurantId,
      this.rating,
      this.description
    ]);
  };
}

module.exports = RestaurantReview;
