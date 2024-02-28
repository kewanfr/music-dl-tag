import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
export default class Database {
  constructor(config) {
    this.db_name = config.DB_NAME || "songs.db";
    this.folder = config.DB_FOLDER || "data";
    this.db_path = path.join(this.folder, this.db_name);

    if (!fs.existsSync(this.folder)) {
      fs.mkdirSync(this.folder);
    }

    this.db = new sqlite3.Database(this.db_path, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Connected to the database.");
    });

    this.verifyDatabase();
  }
  close() {
    this.db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Close the database connection.");
    });
  }

  verifyDatabase() {
    this.db.run(
      "CREATE TABLE IF NOT EXISTS tracks(id TEXT PRIMARY KEY, name TEXT, artists TEXT, album_artist TEXT, album TEXT, cover TEXT, path TEXT, track_position INTEGER, lyrics BOOLEAN)"
    );

    this.db.run(
      "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)"
    );

    this.db.run(
      "CREATE TABLE IF NOT EXISTS user_likes(user_id INTEGER, track_id TEXT, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(track_id) REFERENCES track(id))"
    );
  }

  getDatabasePath() {
    return this.db_path;
  }

  async getTrackById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM tracks WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  }

  async getTrackByNameOrArtist(query) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM tracks WHERE name LIKE ? OR artists LIKE ?`,
        [`%${query}%`, `%${query}%`],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

    async getTracks() {
        return new Promise((resolve, reject) => {
        this.db.all(`SELECT * FROM tracks`, [], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
        });
    }

    async insertTrack(track) {
        return new Promise((resolve, reject) => {
        this.db.run(
            `INSERT INTO tracks(id, name, artists, album_artist, album, cover, path, track_position, lyrics) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
            track.id,
            track.name,
            track.artist,
            track.album_artist,
            track.album.name,
            track.cover,
            track.path,
            track.track_position,
            track.is_lyrics || true,
            ],
            (err) => {
            if (err) reject(err);
            resolve("Track added");
            }
        );
        });
    }

    async deleteTrack(id) {
        return new Promise((resolve, reject) => {
        this.db.run(`DELETE FROM tracks WHERE id = ?`, [id], (err) => {
            if (err) reject(err);
            resolve("Track deleted");
        });
        });
    }

    async insertUser(username, password) {
        return new Promise((resolve, reject) => {
        this.db.run(
            `INSERT INTO users(username, password) VALUES(?, ?)`,
            [username, password],
            (err) => {
            if (err) reject(err);
            resolve("User added");
            }
        );
        });
    }

    async getUserById(id) {
        return new Promise((resolve, reject) => {
        this.db.get(
            `SELECT * FROM users WHERE id = ?`,
            [id],
            (err, row) => {
            if (err) reject(err);
            resolve(row);
            }
        );
        });
    }

    async getUserByUsername(username) {
        return new Promise((resolve, reject) => {
        this.db.get(
            `SELECT * FROM users WHERE username = ?`,
            [username],
            (err, row) => {
            if (err) reject(err);
            resolve(row);
            }
        );
        });
    }

    async insertLike(user_id, track_id) {
        return new Promise((resolve, reject) => {
        this.db.run(
            `INSERT INTO user_likes(user_id, track_id) VALUES(?, ?)`,
            [user_id, track_id],
            (err) => {
            if (err) reject(err);
            resolve("Like added");
            }
        );
        });
    }

    async deleteLike(user_id, track_id) {
        return new Promise((resolve, reject) => {
        this.db.run(
            `DELETE FROM user_likes WHERE user_id = ? AND track_id = ?`,
            [user_id, track_id],
            (err) => {
            if (err) reject(err);
            resolve("Like deleted");
            }
        );
        });
    }

    async getUserLikes(user_id) {
        return new Promise((resolve, reject) => {
        this.db.all(
            `SELECT * FROM user_likes WHERE user_id = ? JOIN tracks ON user_likes.track_id = tracks.id`,
            [user_id],
            (err, rows) => {
            if (err) reject(err);
            resolve(rows);
            }
        );
        });
    }

    async getTrackLikes(track_id) {
        return new Promise((resolve, reject) => {
        this.db.all(
            `SELECT * FROM user_likes WHERE track_id = ? JOIN users ON user_likes.user_id = users.id`,
            [track_id],
            (err, rows) => {
            if (err) reject(err);
            resolve(rows);
            }
        );
        });
    }

}
