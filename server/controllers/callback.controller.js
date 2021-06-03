const axios = require('axios');
const User = require('../models/user.model');
const qs = require('qs');
const line = require('@line/bot-sdk');
const Message = require('../models/message.model');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const LINE = require('../LINE-api/API');
const { cloudUploadAudio, cloudUploadImage } = require('../middlewares/cloudinary');
const fs = require('fs');
const Path = require('path');


// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

exports.callbackClient = async (req, res) => {
    const { code } = req.body;

    const result = await axios({
        method: "POST",
        url: "https://api.line.me/oauth2/v2.1/token",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: qs.stringify({
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': process.env.REDIRECT_URI,
            'client_id': process.env.CLIENT_ID,
            'client_secret': process.env.CLIENT_SECRET
        })
    });


    const userInfo1 = await axios({
        method: "POST",
        url: "https://api.line.me/oauth2/v2.1/verify",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: qs.stringify({
            'id_token': result.data.id_token,
            'client_id': process.env.CLIENT_ID
        })
    });


    const userInfo = await axios({
        method: "GET",
        url: "https://api.line.me/v2/profile",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Authorization': `Bearer ${result.data.access_token}`
        }
    });

    const { userId, displayName, pictureUrl, statusMessage } = userInfo.data;

    const savedUser = await User.findOne({ lineId: userId }).exec();

    if (!savedUser) {
        const user = new User({
            lineId: userId,
            name: displayName,
            avatar: pictureUrl,
            statusMessage,
            email: userInfo1.data.email,
            lastTime: new Date(),
            lastMess: ""
        });


        await user.save(err => {
            if (err) {
                res.send("Error save User");
            } else {
                console.log("--------USER SAVED--------")
            }
        });

    } else {
        await User.findOneAndUpdate({ lineId: userId }, {
            name: displayName,
            avatar: pictureUrl,
            statusMessage,
            email: userInfo1.data.email
        }).exec();
    }

    const accessToken = jwt.sign({ accessToken: result.data.access_token }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200)
        .json({ accessToken, lineId: userId });
}

exports.callbackWebHook = async (req, res) => {
    const io = req.app.get('io');

    req.body.events.map(async event => {
        try {
            await handleEvent(event, io);
        } catch (err) {
            console.log("err in handle event", err);
        }
    })
};

async function downloadImage(id) {
    const url = 'https://api-data.line.me/v2/bot/message/' + id + '/content'
    const path = Path.resolve('./public/uploads', 'image.jpg')
    const writer = fs.createWriteStream(path)

    const response = await axios({
        url,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + process.env.CHANNEL_ACCESS_TOKEN
        },
        responseType: 'stream'
    })

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}

async function downloadAudio(id) {
    const url = 'https://api-data.line.me/v2/bot/message/' + id + '/content'
    const path = Path.resolve('./public/uploads', 'audio.m4a')
    const writer = fs.createWriteStream(path)

    const response = await axios({
        url,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + process.env.CHANNEL_ACCESS_TOKEN
        },
        responseType: 'stream'
    })

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}

// event handler
async function handleEvent(event, io) {
    console.log('event', event);

    if (event.type === "message") {

        if (event.message.type === "text") {
            const message = new Message({
                fromId: event.source.userId,
                toId: "channel",
                type: event.message.type,
                content: event.message.text,
                contentId: event.message.id,
                time: new Date(),
                seen: false,
            });

            await message.save(err => {
                if (err) {
                    console.log("err when save mess");
                } else {
                    console.log("-------MESSAGE SAVED-------");
                }
            });

            await User.findOneAndUpdate(
                { lineId: event.source.userId },
                {
                    lastMess: event.message.text.split('\n')[event.message.text.split('\n').length - 1],
                    lastTime: new Date()
                }
            ).exec();

            io.emit("UserSendMess", { id: event.source.userId });

            // client.replyMessage(event.replyToken, {
            //     type: 'text',
            //     text: 'I cannot leave a 1-on-1 chat!',
            // });
        } else if (event.message.type === "image") {
            await fs.unlink("./public/uploads/image.jpg", (err) => {
                if (err) {
                    console.error(err)
                    return
                }
                console.log("file removed");
            });

            await downloadImage(event.message.id);

            const result = await cloudUploadImage("./public/uploads/image.jpg");
            const images = [];
            images.push(result);

            const message = new Message({
                fromId: event.source.userId,
                toId: 'channel',
                type: 'image',
                content: "",
                images,
                contentId: event.message.id,
                time: moment(),
                seen: false,
            });

            await message.save(err => {
                if (err) {
                    console.log("err when save mess");
                } else {
                    console.log("-------MESSAGE SAVED-------");
                }
            });

            await User.findOneAndUpdate(
                { lineId: event.source.userId },
                {
                    lastMess: "images...",
                    lastTime: new Date()
                }
            ).exec();

            io.emit("UserSendMess", { id: event.source.userId });
        } else if(event.message.type === 'audio') {

            await fs.unlink("./public/uploads/audio.m4a", (err) => {
                if (err) {
                    console.error(err)
                    return
                }
                console.log("file removed");
            });

            await downloadAudio(event.message.id);

            const result = await cloudUploadAudio("./public/uploads/audio.m4a");

            const message = new Message({
                fromId: event.source.userId,
                toId: 'channel',
                type: 'audio',
                content: "",
                images: [],
                contentId: event.message.id,
                time: moment(),
                seen: false,
                link: result
            });

            await message.save(err => {
                if (err) {
                    console.log("err when save mess");
                } else {
                    console.log("-------MESSAGE SAVED-------");
                }
            });

            await User.findOneAndUpdate(
                { lineId: event.source.userId },
                {
                    lastMess: "audio...",
                    lastTime: new Date()
                }
            ).exec();

            io.emit("UserSendMess", { id: event.source.userId });

        }


    }
}