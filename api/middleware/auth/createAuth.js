const fs = require('fs'),
    lcl = require('cli-color'),
    path = require('path'),
    {
        v4: uuidv4
    } = require('uuid');

// get api key from apiKey.json or make one if it doesnt exist
function apiKey(logConsole) {
    // check for auth.json
    if (!fs.existsSync(path.join(__dirname, 'storage', 'apiKey.json'))) {
        console.log(lcl.red("[Error]"), "Missing apiKey.json. Creatingn a new one.");

        // create and save apikey 
        const apiKey = uuidv4();
        fs.writeFileSync(path.join(__dirname, 'storage', 'apiKey.json'), JSON.stringify({
            apiKey: apiKey
        }, null, 4));

        // console log if from start
        if (logConsole) console.log(lcl.blue("[Info]"), `APIKey: "${apiKey}"`);
        // return to client
        return {
            apiKey
        };
    } else {
        // read apiKey.json and return to client (Also console log if logConsole is true)
        const apiKey = JSON.parse(fs.readFileSync(path.join(__dirname, 'storage', 'apiKey.json'))).apiKey;
        if (logConsole) console.log(lcl.blue("[Info]"), `APIKey: "${apiKey}"`);
        return {
            apiKey
        };
    }
}

module.exports = apiKey;