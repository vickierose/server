const express = require('express');
const router = express.Router();
const encodeAvatar = require('../helpers/avatarEncoder');

const User = require('../models/user.model');

router.get('/', (req, res) =>{
    User.find({}).select('-password').exec((err, users) =>{
        if(err) res.send(err);
        res.json(users)
    })
})

router.get('/:id', (req, res) => {
    User.findOne({ _id: req.params.id })
        .exec((err, user) => {
            if(err) res.send(err);
            res.status(200).json(user);
        });
});

router.put('/:id', (req, res) => {
    const avatar = () => {
        if(req.files.avatar){
            return 'data:image/gif;base64,'+req.files.avatar.data.toString('base64');
            }else{
                return ''
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
            res.status(200).send(user);
        });
});

module.exports = router;