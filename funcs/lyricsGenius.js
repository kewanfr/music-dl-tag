import utils from "./utils.js"; // Import utils functions
import { JSDOM } from "jsdom";
import fs from "fs";


class LyricsGeniusFunctions {
  constructor(config) {
    this.QUERY_URL = "https://genius.com/api/search/song?page=1&q=";
  }

  async search(query) {
    let url = `${this.QUERY_URL}${query}`;
    let response = await utils.fetchJSON(url);
    
    if (response.error) {
      return response.error;
    }

    const hits = response.response.sections[0]?.hits;
    if (!hits || hits.length === 0) {
      return [];
    }

    let songs = await hits.map((hit) => {
      return {
        type: hit.type,
        title: hit.result.title,
        artist_names: hit.result.artist_names,
        artist: hit.result.primary_artist.name,
        artists: hit.result.featured_artists.map((artist) => artist.name),
        url: hit.result.url,
        cover: hit.result.song_art_image_url,
      };
    });    

    return songs;
  }

  async cleanHtmlLinks(html) {
    return html.replace(/<a[^>]*>([^<]+)<\/a>/g, "$1");
  }

  async cleanHtmlTags(html) {
    return html.replace(/<[^>]*>/g, "");
  }

  async getLyricsFromURL(url) {
    if (!url || url.length === 0) {
      throw new Error("No URL provided.");
    }

    const response = await utils.fetchPage(url);

    if (!response) {
      return "No lyrics found.";
    }

    const dom = new JSDOM(response);
    // className starts with "Lyrics__Container"
    const lyricsNode = dom.window.document.querySelector(
      "[class^=Lyrics__Container]"
    );

    const lyricsHTML = lyricsNode.innerHTML;

    if (!lyricsHTML) {
      return "No lyrics found.";
    }

    return this.cleanHtmlTags(lyricsHTML.replace(/<br>/g, "\n"));
  }

  async getLyrics(query) {
    let items = await this.search(query);

    if (items.length === 0) {
      return "No lyrics found.";
    }

    let lyrics = await this.getLyricsFromURL(items[0].url);

    return lyrics;
  }

  async getAndSaveTxtLyrics(query, fileName) {
    let lyrics = await this.getLyrics(query);    

    if (lyrics !== "No lyrics found.") {
      fs.writeFileSync(fileName, lyrics);
      return fileName;
    }

    return false;
  }
}

export default LyricsGeniusFunctions;
