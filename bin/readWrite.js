// This video is a lifesaver - https://www.youtube.com/watch?v=EXx-t9CRKeo
const fs = require('fs');

/**
 * Saves JSON to disk
 * 
 * @param {String} String path
 * @param {Object} JSON data 
 * @returns {null} Saved JSON data
 */
function saveJSON(filename, jsonData, suppress) {
    try {
        if (!suppress) console.log(`[Success] Saved JSON data "${filename}"`);
        return fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2));
    } catch (e) {
        if (!suppress) console.log(`[Error] Failed to save JSON data "${filename}"\n`);
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
function readJSON(filename, suppress) {
    if (fs.existsSync(filename)) {
        try {
            if (!suppress) console.log(`[Success] Read JSON data "${filename}"`);
            return JSON.parse(fs.readFileSync(filename).toString());
        } catch (e) {
            if (!suppress) console.log(`[Error] Failed to read JSON data "${filename}"\n`);
            if (process.env.dev == 'true') console.log(e);
            return;
        }
    } else {
        if (!suppress) console.log(`[Error]: File Not Found "${filename}"`);
        return {
            "success": false,
            "message": "Failed to read file",
        };
    }
}

module.exports = {
    saveJSON,
    readJSON
}