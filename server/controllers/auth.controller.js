const axios = require('axios');
const User = require('../models/user.model');
const Store = require('../models/store.model');
const Category = require('../models/category.model');

const qs = require('qs');

exports.index = async (req, res) => {
    res.send("Server connected!!!");
};

exports.createStorePost = async (req, res) => {
    const { store_name, address, category, rank, phone, description } = req.body;
    console.log(req.body);
    const images = req.files;
    const imagesData = [];
    for (let image of images) {
        imagesData.push(image.filename);
    }
    const store = new Store({
        name: store_name,
        images: imagesData,
        description,
        rank: rank.length,
        address,
        phone,
        category
    });

    await store.save(function(err) {
        if(err) {
            console.log(err);
        }
    });

    res.redirect("/create-st");
}

exports.createStoreForm = async (req, res) => {
    if (req.cookies.access_token) {
        const user = await User.findOne({ lineId: req.cookies.id }).exec();

        if (!user) {
            res.redirect('/login');
        } else {
            const categories = await Category.find({}).exec();

            res.render('create_store', {
                name: user.name,
                picture: user.avatar,
                email: user.email,
                statusMessage: user.statusMessage,
                categories
            });
        }
    } else {
        res.redirect('/login');
    }
}

exports.createRichMenuForm = async (req, res) => {
    if (req.cookies.access_token) {
        const user = await User.findOne({ lineId: req.cookies.id }).exec();

        if (!user) {
            res.redirect('/login');
        } else {
            const categories = await Category.find({}).exec();

            res.render('create_rich_menu', {
                name: user.name,
                picture: user.avatar,
                email: user.email,
                statusMessage: user.statusMessage,
                categories
            });
        }
    } else {
        res.redirect('/login');
    }
}

exports.logout = async (req, res) => {
    if (req.cookies.access_token) {
        await axios({
            method: "POST",
            url: "https://api.line.me/oauth2/v2.1/revoke",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: qs.stringify({
                'client_id': process.env.CLIENT_ID,
                'client_secret': process.env.CLIENT_SECRET,
                'access_token': req.cookies.access_token
            })
        });
        res.clearCookie('access_token');
        res.clearCookie('id');
    }
}