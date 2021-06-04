const moment = require('moment');
const User = require('../models/user.model');
const Store = require('../models/store.model');
const Category = require('../models/category.model');
const Message = require('../models/message.model');
const client = require('../config/lineClient');
const { cloudUploadImage, cloudUploadAudio } = require('../middlewares/cloudinary');
const LINE = require('../LINE-api/API');
const Conver = require('../models/conversation.model');
const mongoose = require('mongoose');


exports.category = async (req, res) => {
    const categories = await Category.find().exec();

    res.json({ categories });
}

exports.store = async (req, res) => {
    console.log(req.query);
    const { category } = req.query;

    const listStore = await Store.find({ category }).exec();

    res.json({
        listStore
    });
}

exports.getFriends = async (req, res) => {
    const { userId } = req.body;
    const listFriends = await User.find({_id: {$ne: userId}}).sort({ online: -1, lastActivity: -1  }).exec();

    var result = [];
    for (let i = 0; i < listFriends.length; i++) {
        let fr = listFriends[i];
        let countUnReadMess = await Message.countDocuments({ $and: [{author: fr._id}, {receive: userId}, {seen: false} ] }).exec();
        let conver = await Conver.findOne({members: {$all: [mongoose.Types.ObjectId(userId), mongoose.Types.ObjectId(fr._id)]}}).exec();
        let friendObj = {
            friendData: fr,
            unReadCount: countUnReadMess,
            conver
        };
        result.push(friendObj);
    }

    res.status(200).json({
        errors: [],
        message: "",
        data: {
            listFriends: result
        }
    })
}

exports.getMessages = async (req, res) => {
    const { frId, userId, skip, limit } = req.body;
    await Message.updateMany({$and: [{author: frId, receive: userId}]} , { seen: true }).exec();
    const listMess = await Message.find({ $or: [{$and: [{author: userId},{receive: frId}]}, {$and: [{author: frId},{receive: userId}]} ] }).skip(skip < 0 ? 0 : skip).limit(limit).sort({ _id: -1 }).exec();
    const countMess = await Message.countDocuments({ $or: [{$and: [{author: userId},{receive: frId}]}, {$and: [{author: frId},{receive: userId}]} ] }).exec();
    res.status(200).json({
        errors: [],
        message: "",
        data: {
            listMess,
            hasMoreTop: limit > countMess ? false : true,
            hasMoreBot: skip > 0 ? true : false
        }
    });
}

exports.getMessageById = async (req, res) => {
    const { id } = req.body;
    console.log(req.body);
    const mess = await Message.findOne({_id: id }).exec();
    res.status(200).json({
        errors: [],
        message: "",
        data: {
            mess
        }
    });
}

exports.getImages = async (req, res) => {
    const { id } = req.body;
    console.log(req.body);
    const listMess = await Message.find({ $or: [{ $and: [{ fromId: id }, { toId: 'channel' }, { type: 'image' }] }, { $and: [{ fromId: 'channel' }, { toId: id }, { type: 'image' }] }] }).sort({ _id: -1 }).exec();
    var result = [];
    listMess.forEach(element => {
        result = [...result, ...element.images];
    });
    res.json({
        result
    });
}

exports.postMessage = async (req, res) => {
    console.log('files', req.files);

    const { toId, type } = req.body;

    const io = req.app.get('io');

    if (type === 'image') {
        const images = [];
        for (let file of req.files) {
            let uploadedFilePath = await cloudUploadImage(file.path);
            images.push(uploadedFilePath);
        }

        const message = new Message({
            fromId: 'channel',
            toId,
            type,
            content: "",
            images,
            contentId: "",
            time: moment(),
            seen: true,
        });

        await message.save((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("-------MESSAGE SAVED-------");
            }
        });

        await User.findOneAndUpdate(
            { lineId: toId },
            {
                lastMess: "images...",
                lastTime: new Date()
            }).exec();

        const messages = images.map(img => {
            return {
                type: 'image',
                originalContentUrl: img,
                previewImageUrl: img
            }
        });

        const body = {
            to: toId,
            messages
        }

        await LINE.pushMessage(body)
            .then().catch(err => {
                console.log(err);
            })

        io.emit("UserSendMess", { id: "channel" });

        res.status(200).json({
            errors: [],
            message: "Upload Success"
        });
    } else if (type === 'video') {

        let uploadedFilePath = await cloudUploadAudio(req.files[0].path);

        console.log("uploadedFilePath", uploadedFilePath);

        const message = new Message({
            fromId: 'channel',
            toId,
            type,
            content: "",
            images: [],
            contentId: "",
            time: moment(),
            seen: true,
            link: uploadedFilePath
        });

        await message.save((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("-------MESSAGE SAVED-------");
            }
        });

        await User.findOneAndUpdate(
            { lineId: toId },
            {
                lastMess: "video...",
                lastTime: new Date()
            }).exec();

        const messageLine = {
            type: 'video',
            originalContentUrl: uploadedFilePath,
            previewImageUrl: "https://img.freepik.com/free-vector/abstract-colorful-transparent-polygonal-background_1055-5149.jpg?size=338&ext=jpg"
        }

        const messages = [];
        messages.push(messageLine);

        const body = {
            to: toId,
            messages
        }

        await LINE.pushMessage(body)
            .then().catch(err => {
                console.log(err);
            })

        io.emit("UserSendMess", { id: 'channel' });

        res.status(200).json({
            errors: [],
            message: "Upload Success"
        });
    }
}