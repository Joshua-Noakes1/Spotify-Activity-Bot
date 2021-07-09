const {
    getPreview
} = require('spotify-url-info');


async function makeSpotify(res, data) {
    var spotify = await getPreview(data.url);

    console.log(spotify);

    res.status(200).end();
}

module.exports = {makeSpotify}