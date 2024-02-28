const resultslist = document.getElementById("results-list");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searching = document.getElementById("searching-spin");
const toastsDiv = document.getElementById("toasts");
searching.style.display = "none";

var searchData = [];

searchButton.onclick = search;

const API_BASE = "";

// on enter key press in search input
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    search();
  }
});


function hideSearching() {
  searching.style.display = "none";
}

function showSearching() {
  searching.style.display = "";
}

function addSearchResult(type = "track", searchData) {
  const searchResult = document.createElement("div");
  searchResult.id = searchData.id;
  searchResult.classList.add(
    "flex",
    "items-center",
    "space-x-2",
    "border-b",
    "pb-2",
    "pt-2",
    type == "artist" ? "pointer" : "nopointer"
  );


  searchResult.innerHTML += `<img src="${searchData.cover}" alt="${searchData.name}" width="48" height="48" class="w-12 h-12 ${type == "artist" ? "rounded-full" : "rounded-md"}" loading="lazy" decoding="async">`;
  // const img = document.createElement("img");
  // img.src = searchData.cover;
  // img.alt = searchData.name;
  // img.width = 48;
  // img.height = 48;

  // roundedClass = type == "artist" ? "rounded-full" : "rounded-md";
  // img.classList.add("w-12", "h-12", roundedClass);
  // img.loading = "lazy";
  // img.decoding = "async";

  // searchResult.appendChild(img);

  if (type == "artist") {
    searchResult.innerHTML += `
    <div class="flex-grow">
        <h3 class="font-semibold">${searchData.name}</h3>
    </div>
    <i class="icon chevron-right"></i>
    `;

    searchResult.onclick = () => {
      artistClick(searchData.id);
    };
  } else if (type == "track") {
    searchResult.innerHTML += `
    <div class="flex-grow">
        <h3 class="font-semibold">${searchData.name}</h3>
        <p class="text-gray-400">${searchData.artist}</p>
    </div>
    <button class="text-blue-500 border border-blue-500 px-2 py-1 rounded hover:bg-blue-500 hover:text-white" id="download-${searchData.id}">
        <i class="icon download"></i>
    </button>
    `;
  }

  resultslist.appendChild(searchResult);

  if (type == "track") {
    document.getElementById(`download-${searchData.id}`).onclick = () => {
      trackDownloadClick(searchData.id);
    };
  }
}


function refreshResults() {
  resultslist.innerHTML = "";
  searchData.forEach((result) => {
    if (result.type == "artist") {
      addSearchResult("artist", result);
    } else if (result.type == "track") {
      addSearchResult("track", result);
    }
  });
}


async function fetch_data(query, type = "track", limit = 40){

  const response = await fetch(
    `${API_BASE}/api/search/${query}?type=${type}&limit=${limit}`
  );
  return await response.json();
}

async function push_artist(artist_data){
  searchData.push({
    type: "artist",
    ...artist_data,
  });
}

async function push_track(track_data){
  searchData.push({
    type: "track",
    ...track_data,
  });
}

async function search(){
    const query = searchInput.value;

    if (query.length < 2) {
        return;
    }

    showSearching();

    const artists = await fetch_data(query, "artist", 2);
    const tracks = await fetch_data(query, "track", 40);


    searchData = [];
    if (artists.artists.length > 0) {
      searchData.push({
        type: "artist",
        ...artists.artists[0],
      });
    }

    tracks.tracks.forEach((track) => {
      searchData.push({
        type: "track",
        ...track,
      });
    });

    if (artists.artists.length > 1) {
      searchData.push({
        type: "artist",
        ...artists.artists[1],
      });
    }

    refreshResults();

    hideSearching();
}

async function artistClick(artist_id) {
  // console.log("clicked on artist", artist_id);

  const result = await fetch(`${API_BASE}/api/artist/${artist_id}`);
    const dt = await result.json();

    searchData = [];
    dt.tracks.forEach((track) => {  
        searchData.push({
          type: "track",
          ...track,
        });
        }
    );
    
    refreshResults();
}

async function trackDownloadClick(track_id) {
  
  const track = searchData.find((track) => track.id == track_id);
  // console.log(track);
  console.log(`Downloading ${track.name} - ${track.artist}...`);

  const result = await fetch(`${API_BASE}/api/download`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // body: track,
    body: JSON.stringify(track),
  });
    const dt = await result.json();

    console.log(dt);
    

    if (dt.downloaded) {
      addToast("success", `${dt.song} a bien été téléchargé`);
    } else if (dt.message == "File already exists") {
      addToast("warning", `${dt.song} est déjà téléchargé`);
    } else {
      addToast("danger", `Une erreur s'est produite ${dt.song || "Le son"} n'a pas pu être téléchargé`);
    }
    updateToasts();
  
}

sucessIcon = `<div
  class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
  <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path
      d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
  </svg>
  <span class="sr-only">Check icon</span>
</div>`;

dangerIcon = `<div
  class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
  <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path
      d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
  </svg>
  <span class="sr-only">Error icon</span>
</div>`;

warningIcon = `<div
  class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
  <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path
      d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
  </svg>
  <span class="sr-only">Warning icon</span>
</div>`;

closeButton = `<button type="button"
  class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
  data-dismiss-target="#toast-warning" aria-label="Close">
  <span class="sr-only">Close</span>
  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
  </svg>
</button>`;

function getLocalData(key) {
  if (!localStorage.getItem(key)) {
    localStorage
      .setItem(key, JSON.stringify([]));
  }
  return JSON.parse(localStorage.getItem(key));
}

function setLocalData(key, data) {
  localStorage
    .setItem(key, JSON.stringify(data));
}

function updateToasts() {
  toasts = getLocalData("toasts");

  if (toasts.length > 0) {
    toasts.forEach((toast) => {
      if (!toast.displayed) {
        showToast(toast);
      }
    });
  }
}

function deleteToast(id) {
  document.getElementById(`toast-${id}`).remove();
  toasts = getLocalData("toasts");
  toasts = toasts.filter((toast) => toast.id != id);
  setLocalData("toasts", toasts);
}

function addToast(type = "success", message = "This is a success message") {
  const id = Math.floor(Math.random() * 1000000);

  const toast = {
    id: id,
    type: type,
    message: message,
    displayed: false,
  }

  toasts = getLocalData("toasts");
  toasts.push(toast);
  setLocalData("toasts", toasts);
};


function showToast(toast) {  
  const htmlElement = `<div id="toast-${toast.id}"
    class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
    role="alert">
    ${
      toast.type == "success"
        ? sucessIcon
        : toast.type == "danger"
        ? dangerIcon
        : warningIcon
    }
    <div class="ms-3 text-sm font-normal">${toast.message}</div>
    <button type="button"
      id="close-toast-${toast.id}"
      onclick="deleteToast('${toast.id}')"
      class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
      data-dismiss-target="#toast-success" aria-label="Close">
      <span class="sr-only">Close</span>
      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
      </svg>
    </button>
  </div>`;

  toastsDiv.innerHTML += htmlElement;


  toast.displayed = true;
  toasts = getLocalData("toasts");
  toasts = toasts.map((t) => {
    if (t.id == toast.id) {
      return toast;
    }
    return t;
  });
  setLocalData("toasts", toasts);

  setTimeout(() => {
    deleteToast(toast.id);
  }, 15000);
    
}

toastsDiv.innerHTML = "";
// updateToasts();