const express = require('express');
const router = express.Router();
const { checkToken } = require('../middlewares');
const upload = require('../middlewares/upload');

const {
    update
} = require('../controllers/user.controller');

router.post("/update",upload.single("avatar"), update);

module.exports = router;