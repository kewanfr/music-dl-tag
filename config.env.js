import "dotenv/config";

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  throw new Error("Missing Spotify credentials in .env file.")
}

export default {
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    PORT: process.env.PORT || 3000,
    HOST: process.env.HOST || "localhost",
    TEMP_SONGS_PATH: process.env.TEMP_SONGS_PATH || "./temp/songs",
    TEMP_COVERS_PATH: process.env.TEMP_COVERS_PATH || "./temp/covers",
    FINAL_PATH: process.env.FINAL_PATH || "./songs",

    DB_NAME: process.env.DB_NAME || "music.db",
    DB_FOLDER: process.env.DB_FOLDER || "./db",
};