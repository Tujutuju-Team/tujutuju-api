const { query } = require("../utils/db");

class User {
  constructor({ name = "", email = "", password = "", profilePicture = "" }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.profilePicture = profilePicture;
  }

  static findById = async (id) => {
    return query("SELECT * FROM users WHERE id = $1", [id]);
  };

  static findByEmail = async (email) => {
    return query("SELECT * FROM users WHERE email = $1", [email]);
  };

  static findAll = async (page = 1, size = 1000) => {
    return query(`SELECT * FROM users LIMIT ${size} OFFSET ${page * size}`);
  };

  create = async () => {
    return query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [this.name, this.email, this.password]
    );
  };

  updateById = async () => {
    return query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4",
      [this.name, this.email, this.password, this.id]
    );
  };

  static deleteById = async (id) => {
    return query("DELETE FROM users WHERE id = $1", [id]);
  };

  static deleteByEmail = async (email) => {
    return query("DELETE FROM users WHERE email = $1", [email]);
  };
}
