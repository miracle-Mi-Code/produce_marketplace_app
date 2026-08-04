const { query, isPgConnected, mockStore } = require('../config/db');
const bcrypt = require('bcryptjs');

class UserModel {
  static async findByEmail(email) {
    if (isPgConnected()) {
      const res = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
      return res.rows[0] || null;
    }
    const user = mockStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }

  static async findById(id) {
    if (isPgConnected()) {
      const res = await query('SELECT id, name, email, phone, role, state, lga, created_at FROM users WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    const user = mockStore.users.find(u => u.id === parseInt(id));
    if (!user) return null;
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  static async create({ name, email, password, phone, role, state, lga }) {
    const password_hash = await bcrypt.hash(password, 10);

    if (isPgConnected()) {
      const res = await query(
        `INSERT INTO users (name, email, password_hash, phone, role, state, lga)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, name, email, phone, role, state, lga, created_at`,
        [name, email.toLowerCase(), password_hash, phone, role, state, lga]
      );
      return res.rows[0];
    }

    const newUser = {
      id: mockStore.users.length + 1,
      name,
      email: email.toLowerCase(),
      password_hash,
      phone,
      role,
      state,
      lga,
      created_at: new Date()
    };
    mockStore.users.push(newUser);
    const { password_hash: ph, ...safeUser } = newUser;
    return safeUser;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = UserModel;
