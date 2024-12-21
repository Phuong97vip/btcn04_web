// src/utils/DataBaseProvider/GameDbProvider.js
const pool = require('./db');
const bcrypt = require('bcrypt');

module.exports = class GameDbProvider {
  
  // Get all usernames
  static async GetAllUsername() {
    try {
      const sql = `SELECT username FROM "UserList"`;
      const { rows } = await pool.query(sql);
      return rows.map(row => row.username);
    } catch (error) {
      console.error('GetAllUsername Error:', error);
      return [];
    }
  }

  // Update user's score
  static async UpdateScore(id, point) {
    try {
      const sql = `
        UPDATE "UserList"
        SET score = score + $1
        WHERE id = $2
      `;
      const result = await pool.query(sql, [point, id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('UpdateScore Error:', error);
      return false;
    }
  }

  // Get all users
  static async GetAllUser() {
    try {
      const sql = `SELECT * FROM "UserList"`;
      const { rows } = await pool.query(sql);
      return rows;
    } catch (error) {
      console.error('GetAllUser Error:', error);
      return [];
    }
  }

  // Find user by username
  static async FindUserByUsername(username) {
    try {
      const sql = `SELECT * FROM "UserList" WHERE username = $1 LIMIT 1`;
      const { rows } = await pool.query(sql, [username]);
      return rows[0] || null;
    } catch (error) {
      console.error('FindUserByUsername Error:', error);
      return null;
    }
  }

  // Find user by ID
  static async FindUserById(id) {
    try {
      const sql = `SELECT * FROM "UserList" WHERE id = $1 LIMIT 1`;
      const { rows } = await pool.query(sql, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('FindUserById Error:', error);
      return null;
    }
  }

  // Add new user
  static async AddUser(user) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const sql = `
        INSERT INTO "UserList" (id, username, password, nickname, fullname, image)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await pool.query(sql, [
        user.id,
        user.username,
        hashedPassword,
        user.nickname,
        user.fullname,
        user.image || 'default.jpg'
      ]);
      return true;
    } catch (error) {
      console.error('AddUser Error:', error);
      return false;
    }
  }

  // Update user information
  static async UpdateUser(id, user) {
    try {
      const existingUser = await this.FindUserById(id);
      if (!existingUser) {
        return false; // User does not exist
      }

      const sql = `
        UPDATE "UserList"
        SET nickname = $1,
            fullname = $2,
            image = $3
        WHERE id = $4
      `;
      await pool.query(sql, [
        user.nickname || existingUser.nickname,
        user.fullname || existingUser.fullname,
        user.image || existingUser.image,
        id
      ]);
      return true;
    } catch (error) {
      console.error('UpdateUser Error:', error);
      return false;
    }
  }
};
