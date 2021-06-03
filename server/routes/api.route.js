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
    getMessageById
} = require('../controllers/api.controller');

router.get("/category", category);
router.get("/store", store);
router.post("/friends", checkToken, getFriends);
router.post("/messages", getMessages);
router.post("/send-message", upload.array('files', 12), postMessage);
router.post("/get-images", getImages);
router.post('/messages-detail', getMessageById);

module.exports = router;