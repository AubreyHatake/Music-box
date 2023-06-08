console.log("album")
async function spotifyAlbumLookUp() {
    const response = await fetch("/spotify-lookup-api"+ window.location.search)
    const resultsHtml = await response.text();
    console.log(resultsHtml);
    document.body.innerHTML = resultsHtml
  }
  spotifyAlbumLookUp()