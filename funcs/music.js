import utils from "./utils.js"; // Import utils functions
import SpotifyGet from "spotify-get";
import SpotifyWebApi from "spotify-web-api-node";

import https from "https";
import fs from "fs";
import { promisify } from "util";
import id3 from "node-id3";
import path from "path";

// import LyricsFunctions from "./lyrics.js";
import LyricsFunctions from "./lyrics.js";
import MusicDownloader from "./downloader.js";
import Database from "./database.js";

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

class MusicFunctions {
  constructor(config, database) {
    this.spotifyClient = new SpotifyGet({
      consumer: {
        key: process.env.SPOTIFY_CLIENT_ID,
        secret: process.env.SPOTIFY_CLIENT_SECRET,
      },
    });

    // this.spotifyClient = new SpotifyWebApi({
    //   clientId: config.SPOTIFY_CLIENT_ID,
    //   clientSecret: config.SPOTIFY_CLIENT_SECRET,
    // });

    this.TEMP_SONGS_PATH = config.TEMP_SONGS_PATH;
    this.TEMP_COVERS_PATH = config.TEMP_COVERS_PATH;
    this.FINAL_PATH = config.FINAL_PATH;

    if (!fs.existsSync(this.TEMP_SONGS_PATH)) {
      fs.mkdirSync(this.TEMP_SONGS_PATH, { recursive: true });
    }

    if (!fs.existsSync(this.TEMP_COVERS_PATH)) {
      fs.mkdirSync(this.TEMP_COVERS_PATH, { recursive: true });
    }

    if (!fs.existsSync(this.FINAL_PATH)) {
      fs.mkdirSync(this.FINAL_PATH, { recursive: true });
    }

    this.lyricsController = new LyricsFunctions(config);
    this.downloader = new MusicDownloader(config);
    this.database = new Database(config);
    // this.database = database;

    this.isQueueDownloading = false;
  }

  async downloadCoverTrack(track_data) {
    let { cover, name, album_artist } = track_data;
    let fileName = `${name} - ${album_artist}.jpg`;

    console.log(`Downloading cover for ${name} - ${album_artist}`);
    return new Promise((resolve, reject) => {
      https.get(cover, (response) => {
        response
          .pipe(
            fs.createWriteStream(path.join(this.TEMP_COVERS_PATH, fileName))
          )
          .on("close", () => {
            resolve(fileName);
          })
          .on("error", (error) => {
            reject(error);
          });
      });
    });
  }

  async tagCoverTrack(track_data) {
    let { name, album_artist, album, track_position } = track_data;
    const mp3InputPath = path.join(
      this.TEMP_SONGS_PATH,
      `${name} - ${album_artist}.mp3`
    );

    const mp3OutputPath = path.join(
      this.FINAL_PATH,
      `${album_artist}/${album.name}/${track_position}- ${name}.mp3`
    );

    const coverPath = path.join(
      this.TEMP_COVERS_PATH,
      `${name} - ${album_artist}.jpg`
    );

    console.log(
      "Tagging",
      mp3InputPath,
      "with",
      coverPath,
      "to",
      mp3OutputPath
    );

    try {
      const mp3Data = await readFileAsync(mp3InputPath);
      const imageData = await readFileAsync(coverPath);
      const tags = id3.read(mp3Data);

      tags.image = {
        mime: "image/jpeg",
        type: {
          id: 3,
          name: "front cover",
        },
        description: "Cover",
        imageBuffer: imageData,
      };

      const taggedMp3Data = id3.write(tags, mp3Data);
      await writeFileAsync(mp3OutputPath, taggedMp3Data);

      return mp3OutputPath;
    } catch (error) {
      console.error("Error while tagging", error);
      return false;
    }
  }

  async getArtistTracks(artist_id) {
    const token = await this.spotifyClient.getToken();
    const API_URL = `https://api.spotify.com/v1/artists/${artist_id}/top-tracks?market=FR`;

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    data.tracks = data.tracks.map((item) => {
      let artist = item.artists.map((a) => a.name).join(" / ");

      return {
        name: utils.cleanName(item.name),
        artist: utils.cleanName(artist),
        album_artist: utils.cleanName(item.artists[0].name),
        cover: item.album.images[0].url,

        id: item.id,
        uri: item.external_urls.spotify,
        track_position: item.track_number,
        artists: item.artists.map((a) => {
          return {
            name: a.name,
            id: a.i,
            uri: a.external_urls.spotify,
          };
        }),
        album: {
          id: item.album.id,
          uri: item.album.external_urls.spotify,
          name: utils.cleanName(item.album.name),
          image: {
            url: item.album.images[0].url,
            height: item.album.images[0].height,
            width: item.album.images[0].width,
          },
          release_date: item.album.release_date,
          year: item.album.release_date.split("-")[0],
        },
      };
    });

    return data;
  }

  async search(query, type = "track", limit = 20) {
    type = type.replace(/ /g, "");
    // Search for a song on Spotify and return clean results
    if (type == "*") {
      type = "artist,album,track";
    }

    const searchDatas = await this.spotifyClient.search({
      q: `${query}`,
      type: type,
      limit: limit,
    });

    // return searchDatas;

    if (searchDatas.artists?.items) {
      searchDatas.artists.items = searchDatas.artists.items.map((item) => {
        return {
          name: utils.cleanName(item.name),
          id: item.id,
          genre: item.genres?.join(", "),
          followers: item.followers.total,
          popularity: item.popularity,
          uri: item.external_urls.spotify,
          // images: item.images,
          cover: item.images[0]?.url || null,
        };
      });
    }

    if (searchDatas.albums?.items) {
      searchDatas.albums.items = searchDatas.albums.items.map((item) => {
        return {
          name: utils.cleanName(item.name),
          id: item.id,
          uri: item.external_urls.spotify,
          cover: item.images[0]?.url || null,
          release_date: item.release_date,
          year: item.release_date.split("-")[0],
          total_tracks: item.total_tracks,
          artists: item.artists.map((a) => a.name).join(" / "),
          album_artist: item.artists[0].name,
        };
      });
    }

    if (searchDatas.tracks?.items) {
      searchDatas.tracks.items = searchDatas.tracks.items.map((item) => {
        let artists = item.artists.map((a) => {
          return {
            name: utils.cleanName(a.name),
            id: a.i,
            uri: a.external_urls.spotify,
          };
        });

        let album = {
          id: item.album.id,
          uri: item.album.external_urls.spotify,
          name: utils.cleanName(item.album.name),
          image: {
            url: item.album.images[0].url,
            height: item.album.images[0].height,
            width: item.album.images[0].width,
          },
          release_date: item.album.release_date,
          year: item.album.release_date.split("-")[0],
        };

        let artist = artists.map((a) => a.name).join(" / ");

        return {
          name: utils.cleanName(item.name),
          artist: utils.cleanName(artist),
          album_artist: utils.cleanName(artists[0].name),
          cover: album.image.url,
          id: item.id,
          uri: item.external_urls.spotify,
          artists,
          duration_ms: item.duration_ms,
          album,
          preview_url: item.preview_url,
          track_position: item.track_number,
        };
      });
    }

    // return searchDatas;
    return {
      artists: searchDatas.artists?.items,
      albums: searchDatas.albums?.items,
      tracks: searchDatas.tracks?.items,
    };
  }

  async downloadNextSongInQueue() {
    console.log("isQueueDownloading", this.isQueueDownloading);
    if (this.isQueueDownloading) return;
    const queueSize = await this.database.getPendingQueueSize();
    console.log("queueSize", queueSize);
    if (queueSize === 0) return;

    this.isQueueDownloading = true;

    const songToDownload = await this.database.getNextQueueElement();
    console.log("songToDownload", songToDownload);
    if (!songToDownload) {
      console.log("La file d'attente est vide.");
      this.isQueueDownloading = false;
      return;
    }
    try {

      const downloadingSong = await this.downloadFromTrackId(songToDownload.id);
      if (downloadingSong.error) {
        throw new Error("Error while downloading " + downloadingSong.track);
      }

      await this.database.updateQueueStatus(
        songToDownload.id,
        this.database.QUEUE_STATUS.COMPLETED
      );

    } catch (error) {
      console.error(
        "Une erreur s'est produite lors du téléchargement de la chanson :",
        error
      );
      await this.database.updateQueueStatus(
        songToDownload.id,
        this.database.QUEUE_STATUS.ERROR
      );
    }
    this.isQueueDownloading = false;
    this.downloadNextSongInQueue();
  }

  async downloadVerifQueue(track_data) {
    const downloadQueueSize = await this.database.getPendingQueueSize();

    let finalFileName = path.join(
      `${track_data.album_artist}/${track_data.album.name}`,
      `${track_data.track_position}- ${track_data.name}.mp3`
    );

    if (fs.existsSync(path.join(this.FINAL_PATH, finalFileName))) {
      console.log(`File ${finalFileName} already exists`);
      return {
        message: "File already exists",
        path: finalFileName,
      };
    }

    await this.database.addTrackDataToQueue(
      track_data,
      this.database.QUEUE_STATUS.PENDING
    );

    // this.downloadNextSongInQueue();
    if (downloadQueueSize === 0) {
      return {
        message: "Track added to download queue",
        status: "downloading",
      };
    } else {

        return {
          message: "Track added to download queue",
          status: "pending",
        };
      }
  }

  async downloadFromDatas(track_data) {
    return new Promise(async (resolve, reject) => {
      // Download a song from Spotify using the data object returned by the search function
      let { name, album_artist, album, track_position } = track_data;

      let folderName = `${album_artist}/${album.name}`;
      let tempFileName = `${name} - ${album_artist}.mp3`;
      let finalFileName = path.join(
        folderName,
        `${track_position}- ${name}.mp3`
      );

      console.log(
        `\nTrying to download ${name} - ${album_artist} - ${album.name}`
      );

      if (fs.existsSync(path.join(this.FINAL_PATH, finalFileName))) {
        console.log(`File ${finalFileName} already exists`);
        return {
          message: "File already exists",
          path: finalFileName,
        };
      }

      try {
        await this.downloader.downloadTrack(track_data, tempFileName);
  
        await utils.ensureDir(path.join(this.FINAL_PATH, folderName));
  
        await this.downloadCoverTrack(track_data);
        await this.tagCoverTrack(track_data);
  
        await this.lyricsController.getAndSaveTxtLyrics(
          `${name} ${album_artist}`,
          path.join(this.FINAL_PATH, finalFileName.replace("mp3", "txt"))
        );
  
        fs.unlinkSync(path.join(this.TEMP_SONGS_PATH, tempFileName));
        fs.unlinkSync(
          path.join(this.TEMP_COVERS_PATH, tempFileName.replace("mp3", "jpg"))
        );
  
        await this.database.updateQueueStatus(
          track_data.id,
          this.database.QUEUE_STATUS.COMPLETED
        );
  
        console.log(`Sucessfully downloaded ${tempFileName}\n`);

        resolve({
          message: "File downloaded",
          error: false,
          path: finalFileName,
        })
        
      } catch (error) {
        console.error("Error while downloading", error);
        reject(error);
      }
    });
  }

  async downloadFromTrackId(track_id) {
    const token = await this.spotifyClient.getToken();
    const API_URL = `https://api.spotify.com/v1/tracks/${track_id}?market=FR`;

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const item = await response.json();

    let artist = item.artists.map((a) => a.name).join(" / ");

    let track_data = {
      name: utils.cleanName(item.name),
      artist: utils.cleanName(artist),
      album_artist: utils.cleanName(item.artists[0].name),
      cover: item.album.images[0].url,

      id: item.id,
      uri: item.external_urls.spotify,
      track_position: item.track_number,
      artists: item.artists.map((a) => {
        return {
          name: a.name,
          id: a.i,
          uri: a.external_urls.spotify,
        };
      }),
      album: {
        id: item.album.id,
        uri: item.album.external_urls.spotify,
        name: utils.cleanName(item.album.name),
        image: {
          url: item.album.images[0].url,
          height: item.album.images[0].height,
          width: item.album.images[0].width,
        },
        release_date: item.album.release_date,
        year: item.album.release_date.split("-")[0],
      },
    };

    try {
      const result = await this.downloadFromDatas(track_data);
      return result
    } catch (error) {
      console.error("Error while downloading", error);
      return {
        error: true,
        track: track_data.name + " - " + track_data.artist,
      }
    }
  }
}

export default MusicFunctions;
