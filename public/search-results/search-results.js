console.log("albums")
async function spotifySearch() {
    const response = await fetch("/api/spotify/lookup"+ window.location.search)
    const resultsHtml = await response.text();
    console.log(resultsHtml);
    document.body.innerHTML = resultsHtml
  }
  spotifySearch()