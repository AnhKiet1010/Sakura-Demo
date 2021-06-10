require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = async () => {
    const connection = await mongoose.connect(`mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@mongodb`, {
        dbName: process.env.DB_NAME,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${connection.connection.host}`);
}; 

module.exports = connectDB;