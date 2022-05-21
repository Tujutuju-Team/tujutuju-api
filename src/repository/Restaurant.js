const { query } = require("../utils/db");

class Restaurant {
  constructor({ name, address, email, phone, image }) {
    this.name = name;
    this.address = address;
    this.email = email;
    this.phone = phone;
    this.image = image;
  }

  static findById = async (id) => {
    return query("SELECT * FROM restaurants WHERE id = $1", [id]);
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
    return result.rows;
  };
}

module.exports = Restaurant;
