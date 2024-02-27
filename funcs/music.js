import utils from "./utils.js"; // Import utils functions
import SpotifyGet from "spotify-get";
import { Spotify } from "spotifydl-core";

import https from "https";
import fs from "fs";
import { promisify } from "util";
import id3 from "node-id3";
import path from "path";

import LyricsFunctions from "./lyrics.js";

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

    let credentials = {
      clientId: config.SPOTIFY_CLIENT_ID,
      clientSecret: config.SPOTIFY_CLIENT_SECRET,
    };

    this.spotifyFetch = new Spotify(credentials);

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
  }

  async downloadCoverFromUrl(url, fileName) {
    // From an URL, download the cover and save it to the temp covers folder named after the fileName (without extension)
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        response
          .pipe(
            fs.createWriteStream(
              path.join(this.TEMP_COVERS_PATH, fileName + ".jpg")
            )
          )
          .on("close", () => {
            console.log(`Downloaded cover for ${fileName} from ${url}`);
            resolve();
          });
      });
    });
  }

  async tagImageToMP3(tempFileRoot, finalPath) {
    // Tag the MP3 file with the cover according to the mp3Filename and the cover filename (without extensions)
    const mp3InputPath = path.join(
      this.TEMP_SONGS_PATH,
      tempFileRoot + "_.mp3"
    );
    const mp3OutputPath = path.join(this.FINAL_PATH, finalPath + ".mp3");
    const coverPath = path.join(this.TEMP_COVERS_PATH, tempFileRoot + ".jpg");

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

    console.log(`Tagged MP3 ${tempFileRoot} with cover`);
  }

  async search(query) {
    // Search for a song on Spotify and return clean results
    const searchDatas = await this.spotifyClient.search({
      q: `${query}`,
      type: "track",
      limit: 20,
    });

    // return searchDatas;

    let items = searchDatas.tracks.items.map((item) => {
      let artists = item.artists.map((a) => {
        return {
          name: utils.cleanAuthorName(a.name),
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
      };

      let artist = artists.map((a) => a.name).join(" / ");

      return {
        name: utils.cleanSongName(item.name),
        artist,
        album_artist: artists[0].name,
        cover: album.image.url,
        id: item.id,
        type: item.type,
        uri: item.external_urls.spotify,
        artists,
        duration_ms: item.duration_ms,
        album,
        album_name: album.name,
        preview_url: item.preview_url,
        track_position: item.track_number,
      };
    });
    return items;
  }

  async downloadMP3FromSpotifyUrl(url, fileName) {
    // Download raw MP3 file from Spotify
    const songBuffer = await this.spotifyFetch.downloadTrack(url);

    const song_temp_path = path.join(this.TEMP_SONGS_PATH, fileName + "_.mp3");

    await fs.writeFileSync(song_temp_path, songBuffer);

    console.log(`Downloaded MP3 ${fileName} from Spotify`);

    return songBuffer;
  }

  async downloadMP3(track_data, filename) {
    const songBuffer = await this.spotifyFetch.downloadTrack(track_data.uri);

    const song_temp_path = path.join(this.TEMP_SONGS_PATH, fileName + "_.mp3");

    await fs.writeFileSync(song_temp_path, songBuffer);

    console.log(`Downloaded MP3 ${fileName} from Spotify`);

    return songBuffer;
  }
  async downloadFromDatas(data) {

    // Download a song from Spotify using the data object returned by the search function
    let {
      name,
      artist,
      album_artist,
      id,
      uri,
      cover,
      album,
      duration_ms,
      track_position,
    } = data;

    let folderName = `${album_artist}\\${album.name}`;
    let tempFileName = `${name} - ${album_artist}`;
    // let finalPath = path.join(folderName, `${name}`);
    let finalFileName = path.join(folderName, `${track_position}- ${name}`);

    console.log("folderName", finalFileName);
    console.log("tempFileName", tempFileName);
    console.log("finalFileName", finalFileName);
    console.log(
      `\nTrying to download ${name} - ${album_artist} - ${album.name}`
    );

    if (fs.existsSync(path.join(this.FINAL_PATH, finalFileName + ".mp3"))) {
      console.log(`File ${finalFileName} already exists`);
      return finalFileName + ".mp3";
    }

    await this.downloadMP3FromSpotifyUrl(uri, tempFileName);

    await this.downloadCoverFromUrl(cover, tempFileName);

    await utils.ensureDir(path.join(this.FINAL_PATH, folderName));

    await this.tagImageToMP3(tempFileName, finalFileName);

    await this.lyricsController.getAndSaveTxtLyrics(
      `${name} ${album_artist}`,
      path.join(this.FINAL_PATH, finalFileName + ".txt")
    );

    fs.unlinkSync(path.join(this.TEMP_SONGS_PATH, tempFileName + "_.mp3"));
    fs.unlinkSync(path.join(this.TEMP_COVERS_PATH, tempFileName + ".jpg"));
    console.log(`Deleted temp files : ${tempFileName}`);

    console.log(`Sucessfully downloaded ${tempFileName}\n`);

    return finalFileName + ".mp3";
  }
}

export default MusicFunctions;
