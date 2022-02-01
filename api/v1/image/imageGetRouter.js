const fs = require('fs'),
    path = require('path'),
    verifyAuth = require('../../middleware/auth/checkAuth'),
    express = require('express');

// global express router
const router = express.Router();

router.get('/', verifyAuth, function (req, res) {
    // look to see if img exists
    const imgID = req.query.imgID !== undefined ? req.query.imgID : null;
    if (fs.existsSync(path.join(__dirname, '../', '../', 'public', 'images', `${imgID}.png`))) {
        // set header and send img to client
        res.setHeader('Content-Type', 'image/png');
        return res.sendFile(path.join(__dirname, '../', '../', 'public', 'images', `${imgID}.png`));
    }
    return res.status(404).send('Image not found');
});




module.exports = router;