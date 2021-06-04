const User = require('../models/user.model');
const Store = require('../models/store.model');
const Category = require('../models/category.model');
const Message = require('../models/message.model');
const { cloudUploadImage, cloudUploadAudio } = require('../middlewares/cloudinary');

exports.update = async (req,res) => {
    const {
        name,
        id
    } = req.body;

    console.log('body', req.body);
    
    if(req.file) {
        let uploadedFilePath = await cloudUploadImage(req.file.path);
        var avatar = uploadedFilePath;
        await User.findOneAndUpdate({_id: id}, {avatar}).exec();
    }
    
    await User.findOneAndUpdate({_id: id}, {name}).exec();
    
    const user = await User.findOne({_id: id}).exec();

    console.log('result user', user);

    res.json({
        status: 200,
        data: {
            userInfo: {
                name: user.name,
                id: user.id,
                avatar: user.avatar,
                email: user.email
            }
        }
    });
}