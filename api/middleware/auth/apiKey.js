const lcl = require('cli-color'),
    path = require('path'),
    {
        v4: uuidv4,
        validate: validateUUID
    } = require('uuid'),
    {
        readJSON,
        writeJSON
    } = require('../../../lib/readWrite');

async function auth(req, res, next) {
    const apiKey = req.headers['apiKey'] || req.body['apiKey'] || req.query['apiKey'];
    if (!apiKey) {
        return res.status(401).json({success: false, message: 'No API key provided'});
    }
    if (!validateUUID(apiKey)) {
        return res.status(401).json({success: false, message: 'Invalid API key'});
    }
    if (apiKey !== await getAuth()) {
        return res.status(401).json({success: false, message: 'Invalid API key'});
    }
    next();
}

async function getAuth(isOnLaunch) {
    // read API keys from file
    var apiKeys = await readJSON(path.join(__dirname, '../../../data/apiKeys.json'), true);
    if (!apiKeys.success) var apiKeys = {
        success: true,
        key: uuidv4()
    }

    // write API keys to file
    await writeJSON(path.join(__dirname, '../../../data/apiKeys.json'), apiKeys, true);
    if (isOnLaunch) console.log(lcl.blue('[Express - Info]'), `API key: ${apiKeys.key}`);
    return apiKeys.key;
}

module.exports = {
    auth,
    getAuth
};