const express = require('express');
const router = express.Router();

const ChatRoom = require('../models/chatroom.model');
const Message = require('../models/message.model');
const User = require('../models/user.model');

router.get('/', (req, res) =>{
    Message.find({})
    .populate('user', '-password')
    .exec((err, messages) =>{
        if(err) res.send(err);
        res.json(messages);
    })
})

// create new room

router.post('/newroom', (req, res) => {
    const newRoom = new ChatRoom({
        users: req.body.userId
    });
    newRoom.save((err, room) => {
        if (err) res.send(err);
        User.findOne({_id: req.body.userId})
            .exec((err, user) => {
                user.chats.push(room._id);
                user.save();
            });
        res.json(room);
    })
});

//get messages for room
router.get('/rooms/:id', (req, res) => {
    ChatRoom.findOne({_id: req.params._id})
    .populate('messages')
    .exec((err, room) => {
        Message.find({_id: {$in: room.messages}})
        .populate('user', 'username')
        .exec((err, messages) =>{
            res.json(messages);
        })
    })
})

//get user's chats
router.get('/userId', (req, res) => {
    User.findOne({_id: req.params.userId})
        .exec((err, user) => {
            ChatRoom.find({_id: {$in: user.chats}})
            .populate('messages')
            .populate('users', '-password -chats -_v -email')
            .exec((err, rooms) => {
                const tmpRooms = [];

                rooms.forEach(room =>{
                    const msgCount = room.messages.length;
                    const lastMsg = room.messages[msgCount-1];
                    const userList = room.users.map(user => {
                        return {
                            _id: user._id,
                            username: user.username,
                            avatar: user.avatar
                        }
                    })
                    const tmpRoom ={
                        _id: room._id,
                        users: userList,
                        lastMsg
                    }
                    tmpRooms.push(tmpRoom);
                })
                res.json(tmpRooms);
            })
        })
})

module.exports = router;