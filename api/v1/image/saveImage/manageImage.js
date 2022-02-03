const lcl = require('cli-color'),
    {
        existsSync
    } = require('fs'),
    {
        readJSON,
        writeJSON
    } = require('../../../../lib/readWrite'),
    afe = require('../../../../lib/asyncForEach'),
    path = require('path'),
    {
        v4: uuidv4
    } = require('uuid');

async function saveImage(imageData) {
    // create UUID
    let imageUUID = uuidv4();

    // try and read images json
    let imagesJSON = await readJSON(path.json(__dirname, '../', '../', '../', '../', 'data', 'images.json'));
    if (!imagesJSON.success) imagesJSON = {
        success: true,
        images: []
    };
    try {
        // add uuid
        imageData.imageData.UUID = imageUUID;

        // add image data to images
        imagesJSON.images.push(imageData.imageData);

        // save json
        await writeJSON(path.json(__dirname, '../', '../', '../', '../', 'data', 'images.json'), imagesJSON, true);

        // console log and return 
        console.log(lcl.green("[Image - Success]"), `Saved image data with ID: ${imageUUID}`);
        return {
            success: true
        }
    } catch (error) {
        // console log fail 
        console.log(lcl.red("[Image - Error]"), `Failed to save image data with ID: ${imageUUID}`);
        return {
            success: false
        }
    }

}

async function getImage(imageName) {
    // loop over each image
    let imageCard = {
        success: false
    };
    await afe(imagesJSON.images, async (image, index, images) => {
        if (image.name == tautulli.media.name) {
            imageCard = image;
            return;
        }
    });

    return imageCard;
}

module.exports = saveImage;