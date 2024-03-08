import fs from 'fs';

const cleanName = (str) => str.replace(":", "-");

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
  // return response;
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
  fetchJSON,
  fetchPage,
  ensureDir,
  cleanLineBreaks,

  cleanName,
};