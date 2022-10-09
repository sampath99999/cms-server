const mongoose = require('mongoose');

const networkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: [true, "Username should be unique"]
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('network', networkSchema);