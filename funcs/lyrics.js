import utils from "./utils.js"; // Import utils functions
import { JSDOM } from "jsdom";
import fs from "fs";

class LyricsFunctions {
  constructor(config) {
    this.AZ_SUGGEST_URL = "https://search.azlyrics.com/suggest.php";

  }

  async search(query) {
    let url = `${this.AZ_SUGGEST_URL}?q=${query}`;
    let response = await utils.fetchJSON(url);
    
    console.log(response);
    
    if (response.error) {
      return response.error;
    }

    if (!response.songs || response.songs.length === 0) {
      return [];
    }

    return response.songs;
  }

  async getLyricsFromURL(url) {
    console.log(url);
    
    if (!url || url.length === 0) {
      throw new Error("No URL provided.");
    }

    const response = await utils.fetchPage(url);

    const dom = new JSDOM(response);
    const lyrics = dom.window.document.querySelector(
      "body > div.container.main-page > div.row > div.col-xs-12.col-lg-8.text-center > div:nth-child(8)"
    ).textContent;

    if (!lyrics) {
      return "No lyrics found.";
    }

    // Si les lyrics sont vides
    if (lyrics.length < 10) {
      return "No lyrics found.";
    }

    return utils.cleanLineBreaks(lyrics);
  }

  async getLyrics(query){
    let items = await this.search(query);

    if (items.length === 0) {
      return "No lyrics found.";
    }
    console.log(items);
    
    let lyrics = await this.getLyricsFromURL(items[0].url);

    return lyrics;
  }


  async getAndSaveTxtLyrics(query, fileName) {
    console.log(query);
    
    let lyrics = await this.getLyrics(query);
    console.log(lyrics);
    
    if (lyrics !== "No lyrics found.") {
      fs.writeFileSync(fileName, lyrics);
      return fileName;
    }

    return false;
  }


}

export default LyricsFunctions;
