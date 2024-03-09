import PlexAPI from "plex-api";
import fs from "fs";
import utils from "./utils.js";
const LYBRARY_SECTION_TITLE = "Musique";

const storeFolder = "./store";
if (!fs.existsSync(storeFolder)) {
  fs.mkdirSync(storeFolder);
}

class plexFunctions {
  constructor(config) {
    this.plexOptions = {
      hostname: config.PLEX_URL,
      username: config.PLEX_USERNAME,
      password: config.PLEX_PASSWORD,
      options: {
        identifier: null,
        product: `Plex Music API`,
        version: utils.getProjectVersion(),
        deviceName: config.DEVICE_NAME,
      },
    };

    this.init();
  }

  async init(){
    this.clientIdentifier = await this.getIdentifierFromStore();

    this.plexOptions.options.identifier = this.clientIdentifier;

    this.plexClient = new PlexAPI(this.plexOptions);

    this.plexClient.query("/").then((result) => {
      // save clientIdentifier in store
      console.log('result', result);
      
      this.clientIdentifier = result.MediaContainer.machineIdentifier;

      console.log('clientIdentifier', this.clientIdentifier);
      

      this.saveIdentifierToStore(this.clientIdentifier);
    });
  }

  async getIdentifierFromStore(){
    try {
      let identifier = await fs.readFileSync(`${storeFolder}/plexIdentifier.json`);
      if (!identifier) {
        return null;
      }
      if (identifier.length <2) {
        return null;
      }
      return JSON.parse(identifier).identifier || null;
    } catch (error) {
      return null;
    }
  }
  

  async saveIdentifierToStore(identifier){
    await fs.writeFileSync(`${storeFolder}/plexIdentifier.json`, JSON.stringify({identifier: identifier}));
  }

  async getActualSessions() {
    let sessions = await this.plexClient.find("/status/sessions");
    return sessions;
  }

  async getActualPlaying() {
    let sessions = await this.getActualSessions();
    if (sessions.length === 0) {
      return null;
    }

    let session = sessions.find(
      (session) => session.librarySectionTitle === LYBRARY_SECTION_TITLE
    );

    if (!session) {
      return null;
    }

    // fs.writeFileSync("sessions.json", JSON.stringify(sessions, null, 2));

    const thumbUrl = this.plexClient._generateRelativeUrl(session.thumb);
    const plexToken = this.plexClient.authToken;
    let playing = {
      id: session.ratingKey,
      key: session.key,
      title: session.title,
      type: session.type,
      user: session.User.title,
      artist: session.grandparentTitle,
      album: session.parentTitle,
      mediaPath: session.Media[0].Part[0].file,
      thumb: thumbUrl + "?X-Plex-Token=" + plexToken,
      player: {
        title: session.Player.title,
        address: session.Player.address,
      },
    };

    return playing;
  }

  async parseLyricsResponse(response) {
    if (response.length === 0) {
      return null;
    }
    let lines = response[0].Line;
    if (lines.length === 0) {
      return null;
    }

    return lines.map((line) => {
      return line.Span ? line.Span.map((span) => span.text).join(" ") : "\n";
    }).join("\n");

  }

  async getMetadataFromID(id) {
    let metadata = await this.plexClient.query(`/library/metadata/${id}`);

    const streams =
      metadata.MediaContainer?.Metadata[0]?.Media[0]?.Part[0]?.Stream;

    const lyricsStream = streams.find((stream) => stream.codec === "txt");

    if (!lyricsStream) {
      return null;
    }

    return lyricsStream;
  }

  async getLyricsFromSongID(songId) {
    let metadata = await this.getMetadataFromID(songId);

    if (!metadata) {
      return null;
    }

    let lyrics = await this.plexClient.query(metadata.key);

    if (!lyrics || !lyrics.MediaContainer?.Lyrics) {
      return null;
    }

    return await this.parseLyricsResponse(lyrics.MediaContainer.Lyrics);  
  }

  async getActualPlayingLyrics() {
    let playing = await this.getActualPlaying();
    if (!playing) {
      return null;
    }

    return {
      playing: playing,
      lyrics: await this.getLyricsFromSongID(playing.id),
    }
  }
}

export default plexFunctions;
