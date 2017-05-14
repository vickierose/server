const mongoose = require('mongoose');

const messageUser = mongoose.Schema({
    username: String,
    password: String,
    email: String,
})

const messageSchema = mongoose.Schema({
    user: messageUser,
    msg: {
        type: String,
        required: true
    },
    time: { 
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);