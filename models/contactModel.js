const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, "Enter the username"],
    },
    email: {
        type: String,
        required: [true, "Enter the username"],
    },
    phone: {
        type: String,
        required: [true, "Enter the username"],
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Contact', contactSchema)