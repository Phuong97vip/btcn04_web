// src/utils/DataBaseProvider/AuthDbProvider.js
const pool = require('./db');
const bcrypt = require('bcrypt');

module.exports = class AuthDbProvider {
  
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
      // const hashedPassword = await bcrypt.hash(user.password, 10);
      const sql = `
        INSERT INTO "UserList" (id, username, password, nickname, fullname, image)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await pool.query(sql, [
        user.id,
        user.username,
        user.password,
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

  // Get OAuth configuration
  static async GetAuthConfig() {
    try {
      const sql = `SELECT client_id, client_secret, callback_urls FROM "AuthConfig" ORDER BY id DESC LIMIT 1`;
      const { rows } = await pool.query(sql);
      if (rows.length === 0) return null;

      return {
        clientID: rows[0].client_id,
        clientSecret: rows[0].client_secret,
        callbackURL: rows[0].callback_urls
      };
    } catch (error) {
      console.error('GetAuthConfig Error:', error);
      return null;
    }
  }

  // Update OAuth configuration
  static async UpdateOauthConfig(config) {
    try {
      // Check if a config exists
      const existingConfig = await pool.query(`SELECT * FROM "AuthConfig" ORDER BY id DESC LIMIT 1`);
      if (existingConfig.rows.length === 0) {
        // Insert new config
        const sqlInsert = `
          INSERT INTO "AuthConfig" (client_id, client_secret, callback_urls)
          VALUES ($1, $2, $3)
        `;
        await pool.query(sqlInsert, [
          config.clientID,
          config.clientSecret,
          config.callbackURL
        ]);
      } else {
        // Update existing config
        const sqlUpdate = `
          UPDATE "AuthConfig"
          SET client_id = $1,
              client_secret = $2,
              callback_urls = $3
          WHERE id = $4
        `;
        const latestConfig = existingConfig.rows[0];
        await pool.query(sqlUpdate, [
          config.clientID,
          config.clientSecret,
          config.callbackURL,
          latestConfig.id
        ]);
      }
      return true;
    } catch (error) {
      console.error('UpdateOauthConfig Error:', error);
      return false;
    }
  }
};
