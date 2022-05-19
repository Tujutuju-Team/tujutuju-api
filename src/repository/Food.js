const { query } = require("../utils/db");

class Food {
  constructor({ name, price, description, image }) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.image = image;
  }

  static findById = async (id) => {
    query("SELECT * FROM foods WHERE id = $1", [id]);
  };

  static findAll = async (page, offset) => {
    query(`SELECT * FROM foods LIMIT ${offset} OFFSET ${page * offset}`);
  };

  save = async () => {
    query(
      "INSERT INTO foods (name, price, description, image) VALUES ($1, $2, $3, $4)",
      [this.name, this.price, this.description, this.image]
    );
  };
}
