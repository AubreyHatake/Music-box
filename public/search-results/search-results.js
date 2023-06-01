console.log("beepbeep")
async function spotifySearch() {
    const response = await fetch("/spotify-api"+ window.location.search)
    const resultsHtml = await response.text();
    console.log(resultsHtml);
    document.body.innerHTML = resultsHtml
  }
  spotifySearch()