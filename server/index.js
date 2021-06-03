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

const { channelSendMess, searchMess, changeReact } = require("./controllers/socket.controller");

io.on("connection", async socket => {
    // show connect id in server
    console.log('NEW CONNECTION : ', socket.id);

    socket.on("ChannelSendMess", data => channelSendMess(data, socket));
    socket.on("SearchMess", data => searchMess(data, socket));
    socket.on("SendReact", data => changeReact(data, socket));
});

app.set("io", io);

app.get("/", (req,res) => {
    res.send("Server connected");
});

const userRouter = require("./routes/user.route");
app.use("/user", userRouter);

const authRouter = require("./routes/auth.route");
app.use("/auth", authRouter);

const callbackRouter = require("./routes/callback.route");
app.use('/callback', callbackRouter);

const apiRouter = require("./routes/api.route");
app.use('/api', apiRouter);

httpServer.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})