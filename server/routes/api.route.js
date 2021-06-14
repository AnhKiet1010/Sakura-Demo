const express = require('express');
const router = express.Router();
const { checkToken } = require('../middlewares');
const upload = require('../middlewares/upload');

const {
    category,
    store,
    getFriends,
    getMessages,
    postMessage,
    getImages,
    getMessageById,
    getListNoti,
    acceptNoti
} = require('../controllers/api.controller');

router.get("/category", category);
router.get("/store", store);
router.post("/friends", checkToken, getFriends);
router.post("/messages", getMessages);
router.post("/send-message", upload.array('files', 12), postMessage);
router.post("/get-images", getImages);
router.post('/messages-detail', getMessageById);
router.post('/list-noti', getListNoti);
router.post('/accept-noti', acceptNoti);

module.exports = router;