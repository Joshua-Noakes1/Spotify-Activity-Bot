require('dotenv').config();
const {
    MovieDb
} = require('moviedb-promise');
const moviedb = new MovieDb(process.env.moviedb_API);
const cacheID = require('../../images/cache/lib/getIDFromCache');
const downloadTmdb = require('../../../bin/downloadTMDBImage');
const downloadTautulli = require('../../../bin/downloadTautulliImage');
const downloadFlag = require('../../../bin/downloadFlag');
const createImage = require('../../images/lib/makeImage');

async function plexEpisode(res, tautulli, next) {
    // formatting data to make it easier to use
    var data = {
        "id": await cacheID.getIDFromCache(),
        "name": tautulli.media.playback.name,
        "tagline": `Season ${tautulli.media.playback.seasonNumber} Episode ${tautulli.media.playback.episodeNumber} - "${tautulli.media.playback.episodeName}"`,
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
        },
        "cache": {
            "id": '',
            "name": tautulli.media.playback.name,
            "tagline": '',
            "imageName": '',
            "mediaType": 'episode',
            "episode": {
                "name": tautulli.media.playback.episodeName,
                "seasonNumber": tautulli.media.playback.seasonNumber,
                "episodeNumber": tautulli.media.playback.episodeNumber
            }
        }
    }

    // adding id and tmdb data to data.cache 
    data.cache.id = data.id;
    data.cache.imageName = `image-${data.id}.png`;
    if (data.tmdb.usingTmdb == true) {
        data.cache.tmdb = {
            "data.cache.tmdb.tmdbID": data.tmdb.tmdbID,
            "data.cache.tmdb.tmdbURL": `https://www.themoviedb.org/tv/${data.tmdb.tmdbID}/season/${data.episode.seasonNumber}/episode/${data.episode.episodeNumber}`
        }
    }

    // console logging that we have a new request
    console.log(`[Info] New request for "${data.name}" - "${data.episode.name}" (Season ${data.episode.seasonNumber} - Episode ${data.episode.episodeNumber}) (${data.id})`);


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
            append_to_response: 'season/' + data.episode.seasonNumber
        }).then((tmdbSeason) => {
            tmdbShow = tmdbSeason;
            tmdbEpisode = tmdbSeason[`season/${data.episode.seasonNumber}`].episodes[data.episode.episodeNumber - 1];
        }).catch((e) => {
            // catch errors
            tmdbSuccess = false;
            console.error(`[Error] Failed to grab info for "${data.name}" - "${data.episode.name}" from TMDB`);
            if (process.env.dev == 'true') console.log(e);
        });
    }

    if (tmdbSuccess == true) {
        // plex metadata isnt the fastest to we are going to replace the show name with the tmdb one
        if (tmdbShow.name != '') {
            data.episode.name = tmdbShow.name;
        }

        // downloading the poster and background
        if (tmdbShow.poster_path != '') {
            data.images.poster = await downloadTmdb.downloadTMDBImage(tmdbShow.poster_path);
        }
        if (tmdbEpisode.still_path != '') {
            data.images.background = await downloadTmdb.downloadTMDBImage(tmdbEpisode.still_path);
        }

        // download country flag if show is not english (US)
        if (tmdbShow.origin_country[0] != '' && tmdbShow.origin_country[0] != 'US') {
            data.images.flag = await downloadFlag.downloadFlag(tmdbShow.origin_country[0]);
        }

        // setting tagline to use TMDB data 
        data.tagline = `Season ${tautulli.media.playback.seasonNumber} Episode ${tautulli.media.playback.episodeNumber} - "${data.episode.name}"`
    }

    // generating image
    await createImage.createImage({
        "id": data.id,
        "name": data.name,
        "image": data.images,
        "tagline": data.tagline
    });

    return res.status(200).json({
        "success": true,
        "message": `Generated image for "${data.id}" - "${data.name}"`
    });
}

module.exports = {
    plexEpisode
};