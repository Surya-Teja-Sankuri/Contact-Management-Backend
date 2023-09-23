const express = require('express')
const { userRegister, userLogin, userCurrent } = require('../controllers/userController')
const validateToken = require('../middleware/validateToken')

const userRouter = express.Router()

userRouter.get('/', (req, res) => {
    res.send({url: req.baseUrl, body: req.body})
})
userRouter.post('/register', userRegister)
console.log("user routes")

userRouter.post('/login', userLogin)

userRouter.get('/current', validateToken, userCurrent)

module.exports = userRouter