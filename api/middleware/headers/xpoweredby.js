function customHeaders(req, res, next) {
    res.setHeader('X-Powered-By', 'Hope');
    next();
}

module.exports = customHeaders;