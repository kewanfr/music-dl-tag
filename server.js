import fastify from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";

// Imports des fonctions de l'application
import config from "./config.env.js";
import MusicFunctions from "./funcs/music.js";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const musicController = new MusicFunctions(config);
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

  let items = await musicController.search(query);

  reply.code(200).send(items);
});

app.post("/api/search", async (req, reply) => {
  let data = req.body;

  let items = await musicController.search(data.query);

  reply.code(200).send(items);
});

app.post("/api/download", async (req, reply) => {
  let data = req.body;

  let songPath = await musicController.downloadFromDatas(data);
  return reply.code(200).send(songPath);
});

app.post("/api/searchDownload", async (req, reply) => {
  let items = await musicController.search(req.body.query);

  let songPath = musicController.downloadFromDatas(items[0]);

  reply.code(200).send({
    query: req.body.query || "No query",
    status: "Downloaded",
    songPath,
  });
});

app.get("/api/searchDownload/:query", async (req, reply) => {
  let { query } = req.params;

  let items = await musicController.search(query);

  reply.code(200).send({
    query: query || "No query",
    status: "downloading...",
  });

  let songPath = musicController.downloadFromDatas(items[0]);
});

try {
  await app.listen({ port: 3000,
    host: "192.168.0.50"
  });
  console.log("Server running at http://localhost:3000/");
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
