const express = require('express');
const router = express.Router();
const line = require('@line/bot-sdk');

// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};

const {
    callbackClient,
    callbackWebHook
} = require('../controllers/callback.controller');

router.post("/client", callbackClient);
router.post("/webhook", (req,res,next) => {
    line.middleware(config);
    next();
}, callbackWebHook);

module.exports = router;