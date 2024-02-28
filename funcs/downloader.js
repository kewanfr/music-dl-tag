export default class MusicDownloader {
  constructor(config) {
    this.auth = {
      clientId: config.SPOTIFY_CLIENT_ID,
      clientSecret: config.SPOTIFY_CLIENT_SECRET,
    };
    this.spotifyAPI = new SpotifyAPI(this.auth);
    this.TEMP_SONGS_PATH = config.TEMP_SONGS_PATH;
    this.TEMP_COVERS_PATH = config.TEMP_COVERS_PATH;
    this.FINAL_PATH = config.FINAL_PATH;
  }
}

