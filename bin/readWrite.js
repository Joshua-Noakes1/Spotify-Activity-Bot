// this video is a lifesaver - https://www.youtube.com/watch?v=EXx-t9CRKeo
const fs = require('fs');

/**
 * Saves JSON to disk
 * 
 * @param {string} path 
 * @param {Object} data 
 * @returns Object stringifyed and saved to disk
 */
function saveJSON(path, data) {
    try {
        // console.log(`[Success] Saved JSON data to "${path}"`);
        return fs.writeFileSync(path, JSON.stringify(data, null, 2));
    } catch (e) {
        console.log(`[Error] Failed to save JSON data to "${path}"\n`);
        if (process.env.dev == 'true') console.log(e);
        return;
    }
}

/**
 * Reads JSON from disk and returns its value
 * 
 * @param {string} filename 
 * @returns object
 */
function readJSON(filename) {
    if (fs.existsSync(filename)) {
        try {
            // console.log(`[Success] Read the JSON data "${filename}"`);
            return JSON.parse(fs.readFileSync(filename).toString());
        } catch (e) {
            console.log(`[Error] Failed to read JSON data "${filename}"\n`);
            if (process.env.dev == 'true') console.log(e);
            return;
        }
    } else {
        console.log(`[Error]: "${filename}" File Not Found`);
        return {
            "error": "Data Not Found"
        };
    }
}


module.exports = {
    saveJSON,
    readJSON
}