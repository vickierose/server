const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId
    },
    msg: {
        type: String,
        required: true
    },
    time: { 
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Message', messageSchema);