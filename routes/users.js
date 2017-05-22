const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');

const User = require('../models/user.model');

cloudinary.config({
    cloud_name: 'dfmb0wsun',
    api_key: '219419628733765',
    api_secret: 'ZTU7O0Sdv7i9OgIij1wQrmelKho'
})

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
    console.log(req.body, req.files);
    if(req.files){
        const imgBase64String = 'data:image/gif;base64,'+ req.files.avatar.data.toString('base64')
        cloudinary.uploader.upload(imgBase64String, (result) => {
            const data = {
                username: req.body.username,
                email: req.body.email,
                status: req.body.status,
                avatar: result.url
            }
            User.findOneAndUpdate({ _id: req.params.id }, data, {"new": true})
                .exec((err, user) => {
                    if(err) res.send(err);
                    res.status(200).send(user);
                });
        });
    }else if (req.files ===null){
        const data = {
            username: req.body.username,
            email: req.body.email,
            status: req.body.status,
        }
        User.findOneAndUpdate({ _id: req.params.id }, data, {"new": true})
            .exec((err, user) => {
                if(err) res.send(err);
                res.status(200).send(user);
            });
        }
});

module.exports = router;