const jwt = require('jsonwebtoken');

exports.checkToken = async (req, res, next) => {
    
    const headersToken = req.headers.authorization.split(' ')[1];

    jwt.verify(headersToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            res.json({
                error: true,
                message: "Token expired! Again login please!"
            });
        } else {
            // console.log(decoded);
            next();
        }
    });
}