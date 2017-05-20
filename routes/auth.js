const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const bcrypt = require('bcryptjs');
const encodeAvatar = require('../helpers/avatarEncoder');

const User = require('../models/user.model'); 

router.post('/signup', (req, res) => {
    let passw = req.body.password;
    if(passw.length < 3){
        throw new Error('password is too short')
    }

    const newUser = new User({
        username: req.body.username,
        password: bcrypt.hashSync(passw, 10),
        email: req.body.email
    });

    newUser.save((err, user) => {
        if (err) res.send(err); 
        res.send(user);
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) res.send(err);
        if (user === null) {
            res.sendStatus(404);
        } else {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                const tokenObj = {
                    username: user.username,
                    password: user.password,
                    _id: user._id
                }
                const token = jwt.sign(tokenObj, config.jwtSecret, { noTimestamp: true })
                res.json({
                    user,
                    token,
                    tokenType: 'Bearer'
                });
            } else {
                res.sendStatus(401);
            }
        }
    });
});

router.post('/google', (req, res) => {
    console.log(req)
    const objToSave = {
        username: req.body.username,
        password: req.body.googleId,
        email: req.body.email,
        googleId: req.body.googleId,
        avatar: req.body.avatar
    }

    User.findOrCreate({username: req.body.username}, objToSave, 
    (err, user) => {
        if (err) res.send(err); 

        const tokenObj = {
                    username: user.username,
                    password: user.password,
                    _id: user._id
                }
        const token = jwt.sign(tokenObj, config.jwtSecret, { noTimestamp: true })
        res.json({
            user,
            token,
            tokenType: 'Bearer'
        });
    })
})

module.exports = router;