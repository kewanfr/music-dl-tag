import utils from "./utils.js"; // Import utils functions
import SpotifyGet from "spotify-get";
import SpotifyWebApi from "spotify-web-api-node";

import https from "https";
import fs from "fs";
import { promisify } from "util";
import id3 from "node-id3";
import path from "path";

import LyricsFunctions from "./lyrics.js";
import MusicDownloader from "./downloader.js";

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

class MusicFunctions {
  constructor(config) {
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
  }

  async downloadCoverTrack(track_data) {
    let { cover, name, album_artist } = track_data;
    let fileName = `${name} - ${album_artist}.jpg`;
    return new Promise((resolve, reject) => {
      https.get(cover, (response) => {
        response
          .pipe(
            fs.createWriteStream(path.join(this.TEMP_COVERS_PATH, fileName))
          )
          .on("close", () => {
            resolve(fileName);
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
      `${album_artist}\\${album.name}\\${track_position}- ${name}.mp3`
    );

    const coverPath = path.join(
      this.TEMP_COVERS_PATH,
      `${name} - ${album_artist}.jpg`
    );

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
        name: item.name,
        artist,
        album_artist: item.artists[0].name,
        cover: item.album.images[0].url,
        id: item.id,
        uri: item.external_urls.spotify,
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
          name: item.name,
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
      searchDatas.albums.items = searchDatas.albums.items.map( (item) => {
        return {
          name: item.name,
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
            name: a.name,
            id: a.i,
            uri: a.external_urls.spotify,
          };
        });

        let album = {
          id: item.album.id,
          uri: item.album.external_urls.spotify,
          name: item.album.name,
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
          name: item.name,
          artist,
          album_artist: artists[0].name,
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

  async downloadFromDatas(track_data) {
    // Download a song from Spotify using the data object returned by the search function
    let { name, album_artist, album, track_position } = track_data;

    let folderName = `${album_artist}\\${album.name}`;
    let tempFileName = `${name} - ${album_artist}.mp3`;
    let finalFileName = path.join(folderName, `${track_position}- ${name}.mp3`);

    console.log(
      `\nTrying to download ${name} - ${album_artist} - ${album.name}`
    );

    if (fs.existsSync(path.join(this.FINAL_PATH, finalFileName))) {
      console.log(`File ${finalFileName} already exists`);
      return finalFileName;
    }

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

    console.log(`Sucessfully downloaded ${tempFileName}\n`);

    return finalFileName;
  }
}

export default MusicFunctions;
