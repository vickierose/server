const express = require('express');
const router = express.Router();
const encodeAvatar = require('../helpers/avatarEncoder');

const User = require('../models/user.model');

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
    const avatar = () => {
        if(req.files.avatar){
            return {
                data: req.files.avatar.data,
                contentType: req.files.avatar.mimetype }
            }else{
                return {}
            }
        }
    
    const data = {
       username: req.body.username,
       email: req.body.email,
    //    password: req.body.password,
       status: req.body.status,
       avatar:avatar()
    }
    User.findOneAndUpdate({ _id: req.params.id }, data, {"new": true})
        .exec((err, user) => {
            if(err) res.send(err);
            res.status(200).send(encodeAvatar(user));
        });
});

module.exports = router;