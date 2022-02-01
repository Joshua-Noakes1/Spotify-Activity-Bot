const lcl = require('cli-color');

async function tmdbDataCollection(tautulli) {
    // try tmdb lookup
    const tmdbData = await require('./tmdbLookup')(tautulli);
    if (tmdbData.success) {
        // if tmdb lookup successful, extract data
        switch (tautulli.media.type) {
            case 'movie':
                // get movie data
                var tmdbformatData = {
                    success: true,
                    title: tmdbData.data.title != '' ? tmdbData.data.title : tautulli.media.title,
                    tagline: tmdbData.data.tagline != '' ? tmdbData.data.tagline : tautulli.media.tagline,
                    images: {
                        poster: `https://image.tmdb.org/t/p/original${tmdbData.data.poster_path}`,
                        backdrop: `https://image.tmdb.org/t/p/original${tmdbData.data.backdrop_path}`
                    }
                }
                break;
            case 'episode':
                // get episode data
                var tmdbformatData = {
                    success: true,
                    title: tmdbData.data.name != '' ? tmdbData.data.name : tautulli.media.episode_name,
                    tagline: tmdbData.data["season/" + tautulli.media.season_number + "/episode/" + tautulli.media.episode_number].name !== '' ? `Season ${tautulli.media.season_number} Episode ${tautulli.media.episode_number} - ${tmdbData.data["season/" + tautulli.media.season_number + "/episode/" + tautulli.media.episode_number].name}` : `Season ${tautulli.media.season_number} Episode ${tautulli.media.episode_number} - ${tautulli.media.episode_name}`,
                    images: {
                        poster: `https://image.tmdb.org/t/p/original${tmdbData.data.poster_path}`,
                        backdrop: `https://image.tmdb.org/t/p/original${tmdbData.data["season/" + tautulli.media.season_number + "/episode/" + tautulli.media.episode_number].still_path}`,
                    }
                }
                break;
            default:
                console.log(lcl.yellow("[Plex Image - Warn]"), "Unknown media type");
        }
    } else {
        return {
            success: false
        }
    }

    // return data
    return tmdbformatData;
}

module.exports = tmdbDataCollection;