/**
 * Add x amount of images to div from array
 */
function addImages(cache) {
    // get app container
    var appContainer = $('.app-container');

    for (var i = 0;i < cache.images.length;i++) {
        var imageUrl = `<div><img id="image" src=/cache/${cache.images[i].imageName}></img></div>`

        appContainer.append(imageUrl);
    }
}