const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) return res.sendStatus(403);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decode) => {
            if (err || foundUser.username !== decode.user.username) {
                return res.sendStatus(403);
            }
            const accessToken = jwt.sign({
                user: {
                    username: foundUser.username,
                    email: foundUser.email,
                    id: foundUser.id,
                }
            }, process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            const username = foundUser.username;
            res.json({ accessToken, username })
        }
    )
}

module.exports = { handleRefreshToken }
