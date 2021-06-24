// generate a random 6 digit number that doesnt exist yet
const rw = require('./readWrite');

function randomNum(name) {
    // generate random 6 digit number
    var randomNumber = Math.floor(100000 + Math.random() * 900000); // https://stackoverflow.com/a/21816636

    // read cache table
    var cacheTable = rw.readJSON('./endpoints/plex/types/helper/cache/cacheTable.json');

    for (var i = 0; i < cacheTable.images.length; i++) {
        if (cacheTable.images[i].name != name) {
            if (cacheTable.images[i].id == randomNumber) {
                randomNumber = Math.floor(100000 + Math.random() * 900000); // https://stackoverflow.com/a/21816636
            }
        } else {
            randomNumber = cacheTable.images[i].id;
        }
    }

    return randomNumber
}

module.exports = {
    randomNum
}