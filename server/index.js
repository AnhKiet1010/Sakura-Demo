require('dotenv').config();

const express = require('express');
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
/* Set up static file */
app.use(express.static('public'));
/* Set up bodyparser */
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const connectDB = require("./config/db");
// Connect to database
connectDB();

const { hello, channelSendMess } = require("./controllers/socket.controller");

io.on("connection", async socket => {
    // show connect id in server
    hello(socket);

    socket.on("ChannelSendMess", data => channelSendMess(data, socket));
});

app.set("io", io);

const authRouter = require("./routes/auth.route");
app.use("/", authRouter);

const callbackRouter = require("./routes/callback.route");
app.use('/callback', callbackRouter);

const apiRouter = require("./routes/api.route");
app.use('/api', apiRouter);

httpServer.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})