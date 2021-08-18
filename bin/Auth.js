const path = require('path');
const {
    v4: uuidv4
} = require('uuid');
const {
    readJSON,
    saveJSON
} = require('./readWrite');

// configure API key on first boot then console log 
// try and read auth config
var authConfig = readJSON(path.join(__dirname, '../', 'config', 'auth.json'), true);
if (authConfig.success == false) {
    console.log("Generating API Key");
    // generate API Key
    var APIKey = uuidv4();
    saveJSON(path.join(__dirname, '../', 'config', 'auth.json', true), {
        "success": true,
        "APIKey": APIKey
    });
    console.log(`APIKey: [${APIKey}]`);
} else {
    console.log(`APIKey: [${authConfig.APIKey}]`);
}

/**
 * check if a user is authenctaed
 */
function checkAuth(APIKey, next) {
    // read in, in case its been changed externally 
    var authConfig = readJSON(path.join(__dirname, '../', 'config', 'auth.json'), true);
    if (APIKey != authConfig.APIKey) {
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