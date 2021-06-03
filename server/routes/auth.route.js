const express = require('express');
const router = express.Router();
// const upload = require("./upload.js");

const {
    login,
    register,
    createStorePost,
    createStoreForm,
    createRichMenuForm
} = require('../controllers/auth.controller');

router.post("/login", login);
router.post("/register", register);
// router.post("/create-store",upload.array('images', 12), createStorePost);
router.get("/create-st", createStoreForm);
router.get("/create-rm", createRichMenuForm);

module.exports = router;