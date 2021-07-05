/**
 * Add x amount of images to div from array
 */
function addImages(cache) {
    // get app container
    var appContainer = $('.app-container');

    for (var i = 0;i < cache.images.length;i++) {
        var imageUrl = `<div class="jumbotron image-container"><h5>${cache.images[i].name} - ${cache.images[i].episode.name}</h5><hr><img id="image" src=/cache/${cache.images[i].imageName}></img><a href="${cache.images[i].tmdb['cacheData.tmdb.tmdbURL']}" target="_blank"><br><button id="reload" class="btn btn-outline-primary">See more on TMDB</button></a></div>`
        
        appContainer.append(imageUrl);
    }
}