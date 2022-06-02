const { query } = require("../utils/db");

class User {
  constructor({
    id,
    name = "",
    email = "",
    password = "",
    phone = "",
    avatar = ""
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.avatar = avatar;
  }

  static findById = async (id) => {
    return query("SELECT * FROM users WHERE id = $1", [id]);
  };

  static findByEmail = async (email) => {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
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

  update = async () => {
    return query(
      "UPDATE users SET name = $1, email = $2, password = $3, avatar = $4 WHERE id = $5",
      [this.name, this.email, this.password, this.avatar, this.id]
    );
  };

  static deleteById = async (id) => {
    return query("DELETE FROM users WHERE id = $1", [id]);
  };

  static deleteByEmail = async (email) => {
    return query("DELETE FROM users WHERE email = $1", [email]);
  };
}

module.exports = User;
