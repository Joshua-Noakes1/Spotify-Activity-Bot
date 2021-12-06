// verify auth token
const verifyAuth = async (req, res, next) => {
    // get auth key or body
    const apikey = req.query.key || req.body.key;

    // check if key if valid
    if (!apikey) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }
    if (apikey !== await require('./createAuth')().apiKey) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }

    // return next
    return next();
};

module.exports = verifyAuth;