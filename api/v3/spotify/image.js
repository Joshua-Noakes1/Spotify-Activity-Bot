const
    lcl = require('cli-color'),
    path = require('path'),
    express = require('express'),
    {
        readFileSync,
        existsSync
    } = require('fs');
// global express router
const router = express.Router();

// Api routes
router.get('/:id', async function (req, res) {
    if (existsSync(path.join(__dirname, '../', '../', '../', 'data', 'images', `${req.params.id}.png`))) {
        console.log(lcl.blue('[Image - Info]'), "Image already exists, sending...");
        var localImage = await readFileSync(path.join(__dirname, '../', '../', '../', 'data', 'images', `${req.params.id}.png`));
        res.contentType('image/png');
        return res.send(localImage);
    } else {
        res.status(404).json({success: false, message: "Image not found."});
    }
});


module.exports = router;