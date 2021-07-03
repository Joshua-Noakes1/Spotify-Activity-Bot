const fetch = require('node-fetch');

/**
 * Download a 64x64px country flag from countryflags.io
 * 
 * @param {String} countrySC 
 * @returns Buffer
 */
async function downloadFlag(countrySC) {
    let buffer;
    // download image
    await fetch(`https://www.countryflags.io/${countrySC}/flat/64.png`).then(async (image) => {
        buffer = await image.buffer();
        console.log(`[Info] Grabbed image "${countrySC}" from countryflags.io`);
    }).catch((e) => {
        console.error(`[Error] Failed to grab image "${countrySC}" from countryflags.io`);
        if (process.env.dev == 'true') console.log(e);
        buffer = '';
    });
    // return buffer
    return buffer
}

module.exports = {
    downloadFlag
};