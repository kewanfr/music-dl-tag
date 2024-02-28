import Ffmpeg from "fluent-ffmpeg";
import ytdl from "ytdl-core";
import SpotifyAPI from "spotify-web-api-node";
import yts from "yt-search";
import fs from "fs";

const fsReadFile = (path) => {
  // fs-extra readFile
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};


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

  getYtlink = async (term) => {
    const { videos } = await yts.search(term);
    if (!videos || videos.length === 0) return "";
    return videos.filter((video) => video.seconds < 3600)[0].url;
  };

  downloadYT = async (url, filename) => {
    if (!ytdl.validateURL(url)) throw new Error("Invalid YTURL");
    const stream = ytdl(url, {
      quality: "highestaudio",
      filter: "audioonly",
    });
    try {
      return await new Promise((resolve, reject) => {
        Ffmpeg(stream)
          .audioBitrate(128)
          .save(filename)
          .on("error", (err) => reject(err))
          .on("end", async () => {
            const buffer = await fsReadFile(filename);
            resolve(buffer);
          });
      });
    } catch (err) {
      throw new Error(err);
    }
  };

}

