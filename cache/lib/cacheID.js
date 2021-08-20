const path = require('path');
const {
    v4: uuidv4
} = require('uuid');
const {
    readJSON,
    saveJSON
} = require('../../bin/readWrite');

function getID(data) {
    var UUID = '';

    // load cache
    var cache = (readJSON(path.join(__dirname, '../', 'cache.json'), true));

    // makes cache if it doesnt exist
    if (cache.success != true) {
        saveJSON(path.join(__dirname, '../', 'cache.json'), {
            "success": true,
            "recentImage": "0",
            "images": []
        }, true);
        cache = (readJSON(path.join(__dirname, '../', 'cache.json'), true));
    }

    // loop through all images and check if we have a match based on name, episode and season
    cache.images.forEach((images) => {
        if (images.origin.name == data.name) {
            switch (data.type) {
                case 'episode':
                    if (images.episode.season == data.season && images.episode.episode == data.episode) UUID = image.id;
                    break;
                case 'movie':
                    UUID = image.id;
                    break;
            }
        }
    });

    // assign UUID if its a new image
    if (UUID == '') UUID = uuidv4();

    return UUID;
}

module.exports = {
    getID
}