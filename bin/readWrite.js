// This video is a lifesaver - https://www.youtube.com/watch?v=EXx-t9CRKeo
const fs = require('fs');

/**
 * Saves JSON to disk
 * 
 * @param {String} String path
 * @param {Object} JSON data 
 * @returns {null} Saved JSON data
 */
function saveJSON(filename, jsonData) {
    try {
        console.log(`[Success] Saved JSON data "${filename}"`);
        return fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2));
    } catch (e) {
        console.log(`[Error] Failed to save JSON data "${filename}"\n`);
        if (process.env.dev == 'true') console.log(e);
        return;
    }
}

/**
 * Reads JSON from disk and returns its value
 * 
 * @param {String} String filename
 * @returns {Object} JSON data
 */
function readJSON(filename) {
    if (fs.existsSync(filename)) {
        try {
            console.log(`[Success] Read JSON data "${filename}"`);
            return JSON.parse(fs.readFileSync(filename).toString());
        } catch (e) {
            console.log(`[Error] Failed to read JSON data "${filename}"\n`);
            if (process.env.dev == 'true') console.log(e);
            return;
        }
    } else {
        console.log(`[Error]: File Not Found "${filename}"`);
        return {
            "error": "Data Not Found"
        };
    }
}

module.exports = {
    saveJSON,
    readJSON
}