const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        dropDups: true
    },
    password: {
        type: String,
        required: true,
        // select: false
    },
    email: {
        type: String
    },
    status: {
        type: String
    },
    chats: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Chat'
    },
    avatar: {
        data: Buffer, 
        contentType: String
    }
});

module.exports = mongoose.model('User', UserSchema);