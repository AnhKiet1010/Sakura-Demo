const User = require('../models/user.model');
const Store = require('../models/store.model');
const Category = require('../models/category.model');
const Message = require('../models/message.model');
const { client } = require('../config/lineClient');
const moment = require("moment");



exports.hello = (socket) => {
    console.log("ID connected : ", socket.id);
}

exports.channelSendMess = async (data, socket) => {
    const { toId, content, type } = data;

    const message = new Message({
        fromId: 'channel',
        toId,
        type,
        content,
        contentId: "",
        time: moment(),
        seen: true,
    });

    await User.findOneAndUpdate(
        { lineId: toId },
        {
            lastMess: content.split('\n')[content.split('\n').length - 1],
            lastTime: new Date()
        }).exec();

    try {

        await client.pushMessage(toId, {
            type: 'text',
            text: content,
        });

        await message.save(err => {
            if (err) {
                console.log("err when save mess");
            } else {
                console.log("-------MESSAGE SAVED-------");
            }
        });

        socket.emit("UserSendMess", { id: "channel" });

    } catch (err) {
        console.log(err);
    }
}