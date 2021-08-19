const path = require('path');
const clc = require('cli-color');
const {
    v4: uuidv4
} = require('uuid');
const {
    readJSON,
    saveJSON
} = require('./readWrite');

// on load check for auth
var auth = readJSON(path.join(__dirname, '../', 'config', 'auth.json'), true);
if (auth.success != true) {
    console.log(clc.blue('[Info]'), `Generating API Key`);
    // use uuid to create unique API key for this install
    var APIKey = uuidv4();
    // save new API key to auth.json
    saveJSON(path.join(__dirname, '../', 'config', 'auth.json'), {
        "success": true,
        APIKey
    }, true);
    console.log(clc.green('[Success]'), `APIKey: [${APIKey}]`);
} else {
    console.log(clc.blue('[Info]'), `APIKey: [${auth.APIKey}]`);
}

function checkAuth(APIKey, next) {
    // re-load auth incase its been changed
    auth = readJSON(path.join(__dirname, '../', 'config', 'auth.json'), true);
    if (APIKey != auth.APIKey) {
        const error = new Error("Authentication error");
        error.status = 401;
        next(error);
        return false;
    } else {
        return true;
    }
}

module.exports = {
    checkAuth
}