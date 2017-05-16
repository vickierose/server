const express = require('express');
var fs = require('fs');
const router = express.Router();

const User = require('../models/user.model');

function encodeAvatar( user ) {
    const resUser = {
        username: user.username,
        email: user.email,
        status: user.status,
        password:user.password,
        _id: user._id,
        avatar: 'data:image/gif;base64,' + user.avatar.data.toString('base64')
    };
    return resUser;
}

router.get('/', (req, res) =>{
    User.find({}).select('-password').exec((err, users) =>{
        if(err) res.send(err);
        const base64users = users.map((user) =>{
            if(user.avatar.data){
                return encodeAvatar(user);
            }
            return user;
        });
        res.json(base64users)
    })
})

router.get('/:id', (req, res) => {
    User.findOne({ _id: req.params.id })
        .exec((err, user) => {
            if(err) res.send(err);
            res.status(200).json(encodeAvatar(user));
        });
});

router.put('/:id', (req, res) => {
    const data = {
       username: req.body.username,
       email: req.body.email,
    //    password: req.body.password,
       status: req.body.status,
       avatar:{data: fs.readFileSync(req.body.avatar),
                contentType: 'image/jpeg'} 
    }
    User.findOneAndUpdate({ _id: req.params.id }, data)
        .exec((err, user) => {
            if(err) res.send(err);
            res.status(200).send(user);
        });
});

module.exports = router;