// This video is a lifesaver - https://www.youtube.com/watch?v=EXx-t9CRKeo
const clc = require('cli-color');
const {
    writeFileSync,
    readFileSync,
    existsSync
} = require('fs');

/**
 * Saves JSON to disk
 * 
 * @param {string} filename
 * @param {object} data
 * @param {boolean} suppress
 */
function saveJSON(filename, data, suppress) {
    try {
        if (!suppress) console.log(clc.green('[Success]'), `Saved JSON data ${filename}`);
        return writeFileSync(filename, JSON.stringify(data, null, 2));
    } catch (err) {
        if (!suppress) console.log(clc.red('[Fail]'), `Failed to save JSON data "${filename}"`);
        return console.log(err);
    }
}

/**
 * Reads JSON from disk and returns its value
 * 
 * @param {string} String filename
 * @returns {object} JSON data
 */
function readJSON(filename, suppress) {
    if (existsSync(filename)) {
        try {
            var json = JSON.parse(readFileSync(filename).toString());
            if (!suppress) console.log(clc.green('[Success]'), `Read JSON data "${filename}"`);
            return json;
        } catch (err) {
            if (!suppress) console.log(clc.red('[Fail]'), `Failed to read JSON data "${filename}"`);
            return console.log(err);
        }
    } else {
        if (!suppress) console.log(clc.red('[Fail]'), `: File Not Found "${filename}"`);
        return {
            "success": false,
            "message": "Failed to read file",
        }
    }
}

module.exports = {
    saveJSON,
    readJSON
}