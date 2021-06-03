const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const Store = require('../models/store.model');
const Category = require('../models/category.model');

const qs = require('qs');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email}).exec();

    if(!user) {
        res.json({
            status: 401,
            message: "Email does not exist",
            errors: [{field: 'email'}]
        })
    } else {
        bcrypt.compare(password, user.password, function(err, result) {
            if(!result) {
                res.json({
                    status: 401,
                    message: "Password does not match",
                    errors: [{field: 'password'}]
                })
            } else {
                const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
                res.json({
                    status: 200,
                    data: { accessToken, userInfo: {
                        name: user.name,
                        avatar: user.avatar,
                        email: user.email,
                        id: user._id
                    } }
                })
            }
        })
    }
};

exports.register = async (req, res) => {
    const { email, password } = req.body;

    const repeat_user = await User.findOne({email}).exec();

    if(repeat_user) {
        return res.json({
            status: 409,
            message: "Email is used",
            errors: [{field: 'email'}]
        });
    }

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
            if(err) console.log(err);

            if(!err) {
                const newuser = new User({
                    email,
                    password: hash
                });
    
                await newuser.save((err) => {
                    if(err) {
                        console.log(err);
                    }
                    return res.json({
                        status: 200,
                        message: "Register successful!"
                    });
                });
            }
        });
    });
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

    await store.save(function (err) {
        if (err) {
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