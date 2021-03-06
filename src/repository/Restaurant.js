const { query } = require("../utils/db");

class Restaurant {
  constructor({
    name = "",
    longitude = 0.0,
    latitude = 0.0,
    address = "",
    email = "",
    phone = "",
    description = "",
    images = []
  }) {
    this.name = name;
    this.longitude = longitude;
    this.latitude = latitude;
    this.address = address;
    this.email = email;
    this.phone = phone;
    this.description = description;
    this.images = images;
  }

  static findById = async (id) => {
    const statement = `
      SELECT restaurants.*, t.avg FROM restaurants
      JOIN (
        SELECT restaurant_id, AVG(rating) AS avg FROM restaurant_reviews 
        WHERE restaurant_id = $1
        GROUP BY restaurant_id
      ) AS t
      ON (restaurants.id = t.restaurant_id);
    `;
    const result = await query(statement, [id]);
    const data = result.rows[0];
    const { avg, longitude, latitude, restaurant_id, ...rest } = data;
    return {
      ...rest,
      longitude: +longitude,
      latitude: +latitude,
      review: { average_rating: +avg }
    };
  };

  static count = async () => {
    const result = await query("SELECT COUNT(*) FROM restaurants");
    return +result.rows[0].count;
  };

  static find = async ({ limit = 0, offset = 0 }) => {
    if (limit < 0 || offset < 0) {
      throw new Error("Invalid limit or offset");
    }

    const statement = `
      SELECT * FROM restaurants
      LEFT JOIN (
        SELECT restaurant_id, AVG(rating) FROM restaurant_reviews GROUP BY restaurant_id
      ) AS temp ON (restaurants.id = temp.restaurant_id)
      LIMIT $1 
      OFFSET $2
    `;

    const result = await query(statement, [limit, offset]);
    const data = result.rows;
    return data.map((r) => {
      const { avg, longitude, latitude, restaurant_id, ...rest } = r;
      return {
        ...rest,
        longitude: +longitude,
        latitude: +latitude,
        review: { average_rating: +avg }
      };
    });
  };
}

module.exports = Restaurant;
