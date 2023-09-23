const expressAsyncHandler = require("express-async-handler");
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userRegister = expressAsyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    console.log(req.body)
    if (!username || !email || !password) {
        res.status(400)
        throw new Error('All fields are mandatory')
    }
    const userAvailable = await User.findOne({ email })
    if (userAvailable) {
        res.status(400)
        throw new Error('Email already exist')
    }
    const saltRounds = 10
    const hashedPass = await bcrypt.hash(password, saltRounds)
    const user = await User.create({
        username,
        email,
        password: hashedPass
    })
    if (user)
        res.status(201).json({ _id: user._id, email: user.email })
    else {
        res.status(400)
        throw new Error('User details not valid')
    }
})

const userLogin = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400)
        throw new Error('All fields are mandatory')
    }
    const user = await User.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            }
        }, process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1m', }
        )
        const refreshToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            }
        }, process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '3d', }
        )

        user.refreshToken = refreshToken;
        const result = await user.save();

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: "none", secure: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
        const username = user.username;
        res.status(200).json({ accessToken, username })
    } else {
        res.status(401)
        throw new Error('email or password not valid')
    }
})

const userCurrent = expressAsyncHandler(async (req, res) => {
    res.json(req.user)
})

module.exports = {
    userRegister,
    userLogin,
    userCurrent
}