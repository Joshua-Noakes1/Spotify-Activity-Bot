const path = require('path');
const cloudinary = require('cloudinary');
const {
    readJSON
} = require('../readWrite');
const config = readJSON(path.join(__dirname, '../', '../', 'config', 'config.json'), true);

cloudinary.config({
    cloud_name: config.thirdparty.cloudinary.cloudName,
    api_key: config.thirdparty.cloudinary.APIkey,
    api_secret: config.thirdparty.cloudinary.APISecret
});

async function uploadCloudinary(imagePath, id) {
    var image = {
        "status": true,
        "data": {}
    }

    // check if image exists in cdn
    await cloudinary.v2.api.resource(id,
        function (error, result) {
            image.data = result;
        }).catch((err) => {
        if (err) {
            image.status = false;
            return;
        }
    });

    // upload image
    if (image.status == false) {
        await cloudinary.v2.uploader.upload(imagePath, {
            public_id: id
        }, function (error, result) {
            image.data = result;
            image.status = true;
        }).catch((err) => {
            if (err) {
                image.status = false;
                return;
            }
        });
    }

    return image;
}

module.exports = {
    uploadCloudinary
}