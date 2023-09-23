const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Enter the username']
    },
    email: {
        type: String,
        required: [true, 'Enter the username'],
        unique: [true, 'Email already taken']
    },
    password: {
        type: String,
        required: [true, 'Enter the username']
    },
    refreshToken: String
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)