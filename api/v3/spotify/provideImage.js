const lcl = require("cli-color"),
    path = require("path"),
    {
        readFileSync,
        existsSync,
        statSync
    } = require("fs");

async function serveImage(id) {


    // if (await existsSync(path.join(__dirname, "../", "../", "../", "data", "images", `${id}.png`))) {
    //     console.log(lcl.blue("[Image - Info]"), `Found image "${id}", sending...`);
    //     var image = await readFileSync(path.join(__dirname, "../", "../", "../", "data", "images", `${id}.png`));
    //     var imageStats = await statSync(path.join(__dirname, "../", "../", "../", "data", "images", `${id}.png`));

    //     console.log({
    //         success: true,
    //         image: image,
    //         stats: imageStats
    //     });

    //     // send image
    //     // return {
    //     //     success: true,
    //     //     image: image,
    //     //     stats: imageStats
    //     // }
    //     res.header("Content-Type", "image/png");
    //     res.header("Content-Length", imageStats.size);
    //     return res.json({test: "tset"});
    // } else {
    //     console.log(lcl.yellow("[Image - Warn]"), `Image not found "${id}"`);
    //     return {
    //         success: false,
    //         message: "Not Found"
    //     }
    // }
}

module.exports = serveImage;