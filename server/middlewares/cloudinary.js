const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

exports.cloudUploadImage = async (path) => {
    return await cloudinary.uploader.upload(path, { tags: 'sakura-demo' })
        .then(function (image) {
            console.log("** File Upload to CLOUD");
            return image.secure_url;
        }).catch(err => {
            console.warn(err);
        })
}

exports.cloudUploadAudio = async (path) => {
    const audio = await cloudinary.uploader.upload(path, {resource_type: "video"}, function (err, audio) {
        console.log("** File Upload to CLOUD");
        if(err) console.warn(err);
        return audio;
    });

    return audio.secure_url;
}