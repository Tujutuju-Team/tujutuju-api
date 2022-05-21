const { query } = require("../utils/db");

class PlaceReview {
  constructor({ userId, placeId, rating, descrption }) {
    this.userId = userId;
    this.placeId = placeId;
    this.rating = rating;
    this.descrption = descrption;
  }

  count = async () => {
    const result = await query(
      "SELECT COUNT(*) FROM place_reviews WHERE place_id = $1",
      [this.placeId]
    );
    return +result.rows[0].count;
  };

  find = async ({ limit = 0, offset = 0 }) => {
    if (limit < 0 || offset < 0) {
      throw new Error("Invalid limit or offset");
    }

    const statement = `
      SELECT pr.id AS review_id, pr.rating, pr.description, users.id AS user_id, users.name, users.profile_picture FROM place_reviews AS pr 
      JOIN users ON (pr.user_id = users.id)
      WHERE pr.place_id = $1
      LIMIT $2 
      OFFSET $3
    `;

    const result = await query(statement, [this.placeId, limit, offset]);
    return result.rows;
  };
}

module.exports = PlaceReview;
