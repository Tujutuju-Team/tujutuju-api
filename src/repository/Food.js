const { query } = require("../utils/db");

class Food {
  constructor({ name, price, description, image }) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.image = image;
  }

  static count = async () => {
    const result = await query("SELECT COUNT(*) FROM foods");
    console.log(result);
    return +result.rows[0].count;
  };

  static findById = async (id) => {
    const result = await query("SELECT * FROM foods WHERE id = $1", [id]);
    return result.rows[0];
  };

  static find = async ({ limit = 0, offset = 0 }) => {
    if (limit < 0 || offset < 0) {
      throw new Error("Invalid limit or offset");
    }

    const statement = `SELECT * FROM foods LIMIT $1 OFFSET $2`;

    const result = await query(statement, [limit, offset]);
    return result.rows;
  };
}

module.exports = Food;
