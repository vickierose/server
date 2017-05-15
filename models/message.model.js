const mongoose = require('mongoose');

const messageUser = mongoose.Schema({
    username: String,
    password: String,
    email: String,
})

const messageSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'},
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