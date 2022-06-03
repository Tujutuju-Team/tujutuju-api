const { query } = require("../utils/db");

class Place {
  constructor({
    name = "",
    address = "",
    longitude = 0.0,
    latitude = 0.0,
    description = "",
    images = []
  }) {
    this.name = name;
    this.address = address;
    this.description = description;
    this.longitude = longitude;
    this.latitude = latitude;
    this.images = images;
  }

  static findById = async (id) => {
    const statement = `
      SELECT places.*, t.avg FROM places
      JOIN (
        SELECT place_id, AVG(rating) AS avg FROM place_reviews 
        WHERE place_id = $1
        GROUP BY place_id
      ) AS t
      ON (places.id = t.place_id);
    `;
    const result = await query(statement, [id]);
    const data = result.rows[0];
    const { avg, longitude, latitude, place_id, ...rest } = data;
    return {
      ...rest,
      longitude: +longitude,
      latitude: +latitude,
      review: { average_rating: +avg }
    };
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
    const data = result.rows;
    return data.map((p) => {
      const { avg, longitude, latitude, place_id, ...rest } = p;
      return {
        ...rest,
        longitude: +longitude,
        latitude: +latitude,
        review: { average_rating: +avg }
      };
    });
  };
}

module.exports = Place;
