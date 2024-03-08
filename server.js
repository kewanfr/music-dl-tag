import fastify from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";

// Imports des fonctions de l'application
import config from "./config.env.js";
import MusicFunctions from "./funcs/music.js";
import LyricsFunctions from "./funcs/lyrics.js";
import PlexFunctions from "./funcs/plex.js";
import Database from "./funcs/database.js";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const musicController = new MusicFunctions(config);
const lyricsController = new LyricsFunctions(config);
const plexController = new PlexFunctions(config);

// const database = new Database(config);
// Création de l'application
const app = fastify();

app.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/',
});

app.register(cors, {
  origin: "*",
});

// log all requests
app.addHook("onRequest", (request, reply, done) => {
  console.log(
    `[${request.method}] ${request.url} ${request.ip} ${request.body}`
  );
  done();
});

app.get("/api/search/:query", async (req, reply) => {
  let { query } = req.params;

  // query params
  let limit = req.query.limit || 20;
  let type = req.query.type || "*";

  let items = await musicController.search(query, type, limit);

  reply.code(200).send(items);
});

app.get("/api/artist/:artist_id", async (req, reply) => {
  let { artist_id } = req.params;

  let response = await musicController.getArtistTracks(artist_id);

  reply.code(200).send(response);
});

app.post("/api/search", async (req, reply) => {
  let data = req.body;

  let limit = req.query.limit || 20;
  let type = req.query.type || "*";  

  let items = await musicController.search(data.query, type, limit);

  reply.code(200).send(items);
});

app.post("/api/download", async (req, reply) => {
  let track_data = req.body;  

  // console.log(track_data);

  let response = await musicController.downloadFromDatas(track_data);

  if (response.message && response.message == "File already exists") {
    return reply.code(200).send({
      song: `${track_data.name} - ${track_data.artist}`,
      downloaded: false,
      message: response.message,
      songPath: response.path,
    });
  }

  return reply.code(200).send({
    song: `${track_data.name} - ${track_data.artist}`,
    downloaded: true,
    songPath: response.path,
  });
});

app.post("/api/searchDownload", async (req, reply) => {
  let items = await musicController.search(req.body.query);

  let response = await musicController.downloadFromDatas(items.tracks[0]);
  reply.code(200).send({
    query: req.body.query || "No query",
    downloaded: true,
    songPath: response.path,
  });
});

app.get("/api/searchDownload/:query", async (req, reply) => {
  let { query } = req.params;

  let items = await musicController.search(query);
  let response = await musicController.downloadFromDatas(items.tracks[0]);

  reply.code(200).send({
    query: query || "No query",
    downloaded: true,
    songPath: response.path,
  });

});

app.get("/api/lyrics/:query", async (req, reply) => {
  let { query } = req.params;

  let lyrics = await lyricsController.getLyrics(query);

  reply.code(200).send(lyrics);
});

app.get("/api/playing/lyrics", async (req, reply) => {
  let lyrics = await plexController.getActualPlayingLyrics();

  reply.code(200).send(lyrics);
})

app.get("/api/playing", async (req, reply) => {
  let playing = await plexController.getActualPlaying();

  reply.code(200).send(playing);
});



try {
  await app.listen({ port: config.PORT,
    host: config.HOST
  });
  console.log(`Server running at http://${config.HOST}:${config.PORT}/`);
} catch (err) {
  console.error(err);
  app.log.error(err);
  process.exit(1);
}

// let items = await musicController.search("orelsan", "track,artist", 20);
// console.log(items);


// console.log(database.getDatabasePath());