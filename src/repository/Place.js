const { query } = require("../utils/db");

class Place {
  constructor({ name, address, description, image }) {
    this.name = name;
    this.address = address;
    this.description = description;
    this.image = image;
  }

  static findById = async (id) => {
    query("SELECT * FROM places WHERE id = $1", [id]);
  };

  static count = async () => {
    const result = await query("SELECT COUNT(*) FROM places");
    return +result.rows[0].count;
  };

  static find = async ({ limit = 0, offset = 0 }) => {
    if (limit < 0 || offset < 0) {
      throw new Error("Invalid limit or offset");
    }

    const promise =
      limit || offset
        ? query(`SELECT * FROM places LIMIT $1 OFFSET $2`, [limit, offset])
        : query(`SELECT * FROM places`);

    const result = await promise;
    return result.rows;
  };
}

module.exports = Place;
