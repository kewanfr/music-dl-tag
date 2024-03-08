const lyricsDiv = document.getElementById("lyrics");
const searching = document.getElementById("searching-spin");

const songCover = document.getElementById("song-cover");
const songTitle = document.getElementById("song-title");
const songArtist = document.getElementById("song-artist");
const songAlbum = document.getElementById("song-album");
const songInfos = document.getElementById("song-infos");

const lyricsSource = document.getElementById("lyrics-source");
const lyricsSourceText = document.getElementById("lyrics-source-text");

const API_BASE = "";

function hideSearching() {
  searching.style.display = "none";
}

function showSearching() {
  searching.style.display = "";
}

const getPlaying = async () => {
  const response = await fetch(`${API_BASE}/api/playing`);
  const playing = await response.json();

  return playing;
};

const showPlaying = async (playing) => {
  songInfos.style.display = "";
  songCover.src = playing.thumb;
  songTitle.innerHTML = playing.title;
  songArtist.innerHTML = playing.artist;
  songAlbum.innerHTML = playing.album;
};

const showLyrics = async (lyricsText) => {
  if (!lyricsText || lyricsText === "No lyrics found.") {
    lyricsDiv.innerHTML = "Paroles non trouvées";
    return;
  }
  lyricsDiv.innerHTML = "";
  let lyricsArray = lyricsText.split("\n");
  // Double line breaks are used to separate verses
  lyricsArray.forEach((line) => {
    if (line === "") {
      if (lyricsDiv.innerHTML.slice(-4) !== "<br>") {
        lyricsDiv.innerHTML += "<br>"
      }
    } else {
      let p = document.createElement("p");
      p.innerHTML = line;
      lyricsDiv.appendChild(p);
    }
  });
};


const searchLyrics = async (query) => {
  const response = await fetch(`${API_BASE}/api/lyrics/${query}`);

  if (response.status !== 200) {
    return "No lyrics found.";
  }

  const lyrics = await response.text();

  lyricsSource.style.display = "";
  lyricsSourceText.innerHTML = "Paroles récupérées depuis Genius.com";

  return lyrics;
};

const getPlayingLyrics = async () => {
  const response = await fetch(`${API_BASE}/api/playing/lyrics`);

  const datas = await response.json();
  // console.log(datas);
  
  showPlaying(datas.playing);
  const lyricsText = datas.lyrics;

  lyricsDiv.innerHTML = "";
  if (!lyricsText) {
    lyricsDiv.innerHTML = "No lyrics found";
    const newLyrics = await searchLyrics(
      `${datas.playing.title} ${datas.playing.artist}`
    );
    showLyrics(newLyrics);
  } else {
    lyricsSource.style.display = "";
    lyricsSourceText.innerHTML = "Paroles récupérées depuis Plex";
    showLyrics(lyricsText);
  }

  hideSearching();
};

showSearching();
getPlayingLyrics();
