require('dotenv').config();
const {
    MovieDb
} = require('moviedb-promise');
const moviedb = new MovieDb(process.env.moviedb_API);
const fs = require('fs');
const cacheID = require('../../images/cache/lib/getIDFromCache');
const downloadTmdb = require('../../../bin/downloadTMDBImage');
const downloadTautulli = require('../../../bin/downloadTautulliImage');
const downloadFlag = require('../../../bin/downloadFlag');
const createImage = require('../../images/lib/makeImage');

/**
 * 
 * @param {Object} res - Object
 * @param {Object} tautulli - Object
 * @param {Object} next - Object
 * @returns {Object} Response to client
 */
async function plexEpisode(res, tautulli, next) {
    // formatting data to make it easier to use
    var data = {
        "id": await cacheID.getIDFromCache({
            "type": 'episode',
            "name": tautulli.media.playback.name,
            "seasonNumber": tautulli.media.playback.seasonNumber,
            "episodeNumber": tautulli.media.playback.episodeNumber
        }),
        "name": tautulli.media.playback.name,
        "tagline": `Season ${tautulli.media.playback.seasonNumber} Episode ${tautulli.media.playback.episodeNumber} - "${tautulli.media.playback.episodeName}"`,
        "overview": tautulli.media.playback.tagline,
        "latestImage": `${tautulli.media.playback.name} - Season ${tautulli.media.playback.seasonNumber} Episode ${tautulli.media.playback.episodeNumber}`,
        "region": 'EN',
        "plexURL": tautulli.media.playback.plexURL,
        "episode": {
            "name": tautulli.media.playback.episodeName,
            "seasonNumber": tautulli.media.playback.seasonNumber,
            "episodeNumber": tautulli.media.playback.episodeNumber
        },
        "tmdb": {
            "tmdbID": tautulli.media.tmdbID != '' ? `${tautulli.media.tmdbID}` : '000000',
            "usingTmdb": tautulli.media.tmdbID != '' ? true : false
        },
        "images": {
            "poster": '',
            "background": '',
            "flag": ''
        }
    }

    // console logging that we have a new request
    console.log(`[Info] New request for "${data.name}" - "${data.episode.name}" (Season ${data.episode.seasonNumber} - Episode ${data.episode.episodeNumber}) (${data.id})`);

    // checking if image exists 
    var imgExist = fs.existsSync(`./lib/images/cache/image-${data.id}.png`) ? true : false;

    if (imgExist == false) {
        // download poster from Tautulli 
        data.images.poster = await downloadTautulli.downloadTautulliImage(tautulli.media.playback.posterURL);

        // if tmdb is true we try and get info on the episode and show
        if (data.tmdb.usingTmdb == true) {
            // check to see if we get an error from tmdb
            var tmdbSuccess = true;

            // get show and episode info
            var tmdbEpisode;
            var tmdbShow;
            await moviedb.tvInfo({
                id: data.tmdb.tmdbID,
                append_to_response: 'season/' + data.episode.seasonNumber,
                language: 'en'
            }).then((tmdbSeason) => {
                tmdbShow = tmdbSeason;
                tmdbEpisode = tmdbSeason[`season/${data.episode.seasonNumber}`].episodes[data.episode.episodeNumber - 1];
            }).catch((e) => {
                // catch errors
                tmdbSuccess = false;
                console.error(`[Error] Failed to grab info for "${data.name}" - "${data.episode.name}" from TMDB`);
                if (process.env.dev == 'true') console.log(e);
            });

            if (tmdbSuccess == true) {
                // plex metadata isnt the fastest to we are going to replace the show name with the tmdb one
                if (tmdbShow.name != null) {
                    data.episode.name = tmdbEpisode.name;
                }

                // downloading the poster and background
                if (tmdbShow.poster_path != null) {
                    data.images.poster = await downloadTmdb.downloadTMDBImage(tmdbShow.poster_path);
                }
                if (tmdbEpisode.still_path != null) {
                    data.images.background = await downloadTmdb.downloadTMDBImage(tmdbEpisode.still_path);
                }

                // download country flag if show is not english (US)
                if (tmdbShow.origin_country[0] != '' && tmdbShow.origin_country[0] != 'US' && tmdbShow.origin_country[0] != 'GB') {
                    data.images.flag = await downloadFlag.downloadFlag(tmdbShow.origin_country[0]);
                    data.region = tmdbShow.origin_country[0];
                }

                if (tmdbEpisode.overview != null) {
                    // setting overview to use tmdb
                    data.overview = tmdbEpisode.overview;
                }

                // setting tagline to use TMDB data 
                data.tagline = `Season ${tautulli.media.playback.seasonNumber} Episode ${tautulli.media.playback.episodeNumber} - '${data.episode.name}'`;

                // setting latest image to use tmdb data
                data.latestImage = `${data.name} - Season ${data.episode.seasonNumber} Episode ${data.episode.episodeNumber}`;
            }
        }

    }

    // cache data
    var cacheData = {
        "id": data.id,
        "name": data.name,
        "tagline": data.tagline,
        "overview": data.overview,
        "imageName": `image-${data.id}.png`,
        "latestImage": data.latestImage,
        "region": data.region,
        "plexURL": data.plexURL,
        "mediaType": 'episode',
        "timestamp": `${Math.floor(Date.now() / 1000)}`,
        "episode": {
            "name": data.episode.name,
            "seasonNumber": data.episode.seasonNumber,
            "episodeNumber": data.episode.episodeNumber
        }
    }
    // add tmdb to cache
    if (data.tmdb.usingTmdb == true) {
        cacheData.tmdb = {
            "tmdbID": data.tmdb.tmdbID,
            "tmdbURL": `https://www.themoviedb.org/tv/${data.tmdb.tmdbID}/season/${data.episode.seasonNumber}/episode/${data.episode.episodeNumber}`
        }
    }

    // generating image
    await createImage.createImage({
        "id": data.id,
        "name": data.name,
        "image": data.images,
        "tagline": data.tagline
    }, cacheData);

    return res.status(200).json({
        "success": true,
        "message": `Generated image for "${data.id}" - "${data.name}"`
    });
}

module.exports = {
    plexEpisode
};