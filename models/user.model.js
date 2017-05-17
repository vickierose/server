const mongoose = require('mongoose');

const emailRE = /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/;
const passwordValidator = [
    function(value){
        return value.length >= 3;
    },
    'Password is too short'];

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
        validate: passwordValidator
    },
    email: {
        type: String,
        required: true,
        match: emailRE
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