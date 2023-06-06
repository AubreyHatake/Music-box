const album = document.querySelector('#searchBox')
const searchForm = document.querySelector('#searchForm')
console.log(album)
console.log(searchButton)
searchForm.addEventListener("submit", function (e){
    e.preventDefault()
    const query = album.value
    window.location.href='/search-results/' + query
})