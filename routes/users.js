const express = require('express');
var fs = require('fs');
const router = express.Router();

const User = require('../models/user.model');

router.get('/', (req, res) =>{
    User.find({}).select('-password').exec((err, users) =>{
        if(err) res.send(err);
        // const base64users = users.map((user) =>{
        //     if(user.avatar){
        //         user.avatar = user.avatar.data;
        //     }
        //     return user;
        // })
        res.json(users)
    })
})

router.get('/:id', (req, res) => {
    User.findOne({ _id: req.params.id })
        .exec((err, user) => {
            // const resUser = {
            //     username: user.username,
            //     email: user.email,
            //     status: user.status,
            //     password:user.password,
            //     _id: user._id,
            //     avatar: user.avatar.data.toString('base64')
            // }
            if(err) res.send(err);
            res.status(200).json(user);
        });
});

router.put('/:id', (req, res) => {
    const data = {
       username: req.body.username,
       email: req.body.email,
    //    password: req.body.password,
       status: req.body.status
    //    avatar:{data: fs.readFileSync(req.body.avatar),
    //             contentType: 'image/jpeg'} 
    }
    User.findOneAndUpdate({ _id: req.params.id }, data)
        .exec((err, user) => {
            if(err) res.send(err);
            res.status(200).send(user);
        });
});

module.exports = router;