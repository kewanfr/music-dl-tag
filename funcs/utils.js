import fs from 'fs';

const cleanAuthorName = (name) => {
  return name
    .replaceAll(/ *\([^)]*\) */g, "")
    .replaceAll(" - Topic", "")
    .replaceAll("é", "e")
    .replaceAll("/", "")
    .replaceAll("?", "")
    .replaceAll(":", "")
    .replaceAll(".", "");
};

const cleanSongName = (name) => {
  return name
    .replaceAll(/ *\([^)]*\) */g, "")
    .replaceAll(" - Topic", "")
    .replaceAll("é", "e")
    .replaceAll("/", "")
    .replaceAll("?", "")
    .replaceAll(":", "")
    .replaceAll(".", "")
    .replace("*", "");
};

const fetchUtils = (args) => {
  return new Promise((resolve, reject) => {
    fetch(args, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}


const fetchJSON = async (args) => {

  const response = await fetch(args);
  

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  const json = await response.json();
  return json;
}

const fetchPage = async (args) => {
  const response = await fetch(args);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  // response.
  const text = await response.text();
  return text;
}

const ensureDir = async (dir) => {
  if (!fs.existsSync(dir)) {
    return await fs.mkdirSync(dir, { recursive: true });
  }
  return true;
};

const cleanLineBreaks = (str) => str.replace(/^\s+|\s+$/g, "");

export default {
  cleanAuthorName,
  cleanSongName,
  fetchJSON,
  fetchPage,
  ensureDir,
  cleanLineBreaks,
};