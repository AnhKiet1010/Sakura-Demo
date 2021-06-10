const User = require('../models/user.model');
const Store = require('../models/store.model');
const Category = require('../models/category.model');
const Message = require('../models/message.model');
const { client } = require('../config/lineClient');
const moment = require("moment");
const Conver = require('../models/conversation.model');
const mongoose = require('mongoose');

exports.handleOnlineStatus = async (data, socket) => {
    const { id } = data;

    await User.findOneAndUpdate({ _id: id }, { online: true, socketId: socket.id, lastActivity: new Date() }).exec();

    socket.broadcast.emit("UserStateChange");
}

exports.handleOfflineStatus = async (socketId, socket) => {

    await User.findOneAndUpdate({ socketId }, { online: false, socketId: "", last_activity: new Date() }).exec();

    socket.broadcast.emit("UserStateChange");
}

exports.handleUserSeenMess = async (data, socket) => {
    const { ofId, fromId } = data;
    await Message.updateMany({ $and: [{ author: ofId, receive: fromId }] }, { seen: true }).exec();

    const ofUser = await User.findOne({ _id: ofId }).exec();

    if (ofUser.online) {
        socket.to(ofUser.socketId).emit("ChangeMessStatusToSeen", { id: fromId });
    }
}

exports.handleUserStartTyping = async (data, socket) => {
    const { fromId, toId } = data;

    const toUser = await User.findOne({ _id: toId }).exec();

    if (toUser.online) {
        socket.to(toUser.socketId).emit("SetStartTyping", { id: fromId });
    }
}

exports.handleUserEndTyping = async (data, socket) => {
    const { fromId, toId } = data;

    const toUser = await User.findOne({ _id: toId }).exec();

    if (toUser.online) {
        socket.to(toUser.socketId).emit("SetEndTyping", { id: fromId });
    }
}

exports.channelSendMess = async (data, socket) => {
    const { fromId, toId, content, type, reply } = data;
    console.log('User send mess socket', data);

    const message = new Message({
        author: fromId,
        receive: toId,
        type,
        content,
        time: moment(),
        seen: false,
        reply
    });

    await User.findOneAndUpdate(
        { _id: fromId },
        {
            lastActivity: new Date()
        }).exec();

    await Conver.findOneAndUpdate(
        { members: {$all: [mongoose.Types.ObjectId(fromId), mongoose.Types.ObjectId(toId)]} },
        {
            lastMess: content.split('\n')[content.split('\n').length - 1]
        }).exec();

    const toUser = await User.findOne({ _id: toId }).exec();

    // if (toUSer.socialRegister && toUSer.socialInfo.socialName === 'line') {

    //     try {

    //         await client.pushMessage(toId, {
    //             type: 'text',
    //             text: content,
    //         });



    //     } catch (err) {
    //         console.log(err);
    //     }

    // }

    await message.save(err => {
        if (err) {
            console.log("err when save mess");
        } else {
            console.log("-------MESSAGE SAVED-------");
        }
    });

    if (toUser.online) {
        socket.to(toUser.socketId).emit("UserSendMessToUser");
    }

    socket.emit("UserSendMessToChangeData");
}

exports.searchMess = async (data, socket) => {
    console.log('data', data);
    const { text, skip, limit } = data;

    const query = text.toLowerCase().replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&");

    const listMessFilter = await Message.find({ content: { $regex: query, $options: 'i' } }).skip(skip).limit(parseInt(limit)).sort({ _id: -1 }).exec();
    const count = await Message.countDocuments({ content: { $regex: query, $options: 'i' } }).sort({ _id: -1 }).exec();
    socket.emit('OnChangeListMessBySearch', {
        listMessFilter: listMessFilter,
        searchTotal: count
    });
}

exports.changeReact = async (data, socket) => {

    const { messId, react, id } = data;

    await Message.findOneAndUpdate({ _id: messId }, { react }, (err) => {
        if (err) {
            console.log(err);
        } else {
        }
    });

    const messChange = await Message.findOne({_id: messId}).exec();
    
    const toUser = await User.findOne({ _id: id }).exec();
    
    if (toUser.online) {
        socket.to(toUser.socketId).emit("ChangeReact",  { messChange, react });
    }

    socket.emit("ChangeReact", { messChange, react });

}

exports.userLogout = async (data, socket) => {

    const { userId } = data;

    await User.findOneAndUpdate({_id: userId}, {online: false}).exec();

    socket.broadcast.emit("UserStateChange");
}

exports.deleteMess = async (data, socket) => {
    const { messId, toId, fromId } = data;
    console.log("data", data);

    await Message.updateMany({ $or: [{_id: messId}, {reply: messId }]}, {active: false}).exec();

    await updateLastMess(fromId, toId);
    
    const toUser = await User.findOne({ _id: toId }).exec();

    if (toUser.online) {
        socket.to(toUser.socketId).emit("UserDeleteMess");
    }

    socket.emit("UserDeleteMess");
}

exports.recallMess = async (data, socket) => {
    console.log('recall mess id', data);
    const { messId, toId, fromId } = data;

    await Message.findOneAndUpdate({_id: messId}, {recall: true});

    await updateLastMess(fromId, toId);
    
    const toUser = await User.findOne({ _id: toId }).exec();

    if (toUser.online) {
        socket.to(toUser.socketId).emit("UserRecallMess");
    }

    socket.emit("UserRecallMess");
}

async function updateLastMess(authorId, toId) {
    const lastMess = await Message.findOne({ $or: [{ $and: [{ author: authorId }, { receive: toId }, { active: true }, {recall: false}] }, { $and: [{ author: toId }, { receive: authorId }, { active: true }, {recall: false}] }] }).sort({ _id: -1 }).exec();
    let content = "";
    if(lastMess) {
        content = lastMess.content
    }
    await Conver.findOneAndUpdate(
        { members: {$all: [mongoose.Types.ObjectId(authorId), mongoose.Types.ObjectId(toId)]} },
        {
            lastMess: content.split('\n')[content.split('\n').length - 1]
        }).exec();
}   