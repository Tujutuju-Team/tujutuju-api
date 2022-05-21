const { query } = require("../utils/db");

class Place {
  constructor({ name, address, description, image }) {
    this.name = name;
    this.address = address;
    this.description = description;
    this.image = image;
  }

  static findById = async (id) => {
    const result = await query("SELECT * FROM places WHERE id = $1", [id]);
    return result.rows[0];
  };

  static count = async () => {
    const result = await query("SELECT COUNT(*) FROM places");
    return +result.rows[0].count;
  };

  static find = async ({ limit = 0, offset = 0 }) => {
    if (limit < 0 || offset < 0) {
      throw new Error("Invalid limit or offset");
    }

    const statement = `
      SELECT * FROM places
      LEFT JOIN (
        SELECT place_id, AVG(rating) FROM place_reviews GROUP BY place_id
      ) AS temp ON (places.id = temp.place_id)
      LIMIT $1 
      OFFSET $2
    `;

    const result = await query(statement, [limit, offset]);
    return result.rows;
  };
}

module.exports = Place;
