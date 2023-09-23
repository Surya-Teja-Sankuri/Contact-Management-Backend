const expressAsyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const validateToken = expressAsyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
            if (err) {
                res.status(403);
                throw new Error('Unauthorized User');
            }
            req.user = decode.user;
            next()
        })
    } else {
        res.status(403)
        throw new Error('Invalid user')
    }
})

module.exports = validateToken