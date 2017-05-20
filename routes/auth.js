const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const bcrypt = require('bcryptjs');
const GoogleAuth = require('google-auth-library');

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
                    avatar: user.avatar,
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
    
    const auth = new GoogleAuth();
    const client = new auth.OAuth2(config.googleClientId, '', '');
    client.verifyIdToken(
        req.body.id_token,
        config.googleClientId,
        (e, login) => {
            const payload = login.getPayload();
            const userid = payload['sub'];
            if(payload.aud === config.googleClientId){
                const resObj = {
                    username: payload.name,
                    password: payload.sub,
                    googleId: payload.sub,
                    email: payload.email,
                    avatar: payload.picture
                }
                User.findOrCreate({username: payload.name}, resObj, 
                (err, user) => {
                    if (err) res.send(err); 
                    const token = jwt.sign(user, config.jwtSecret, { noTimestamp: true })
                    res.json({
                        user,
                        token,
                        tokenType: 'Bearer'
                    });
                })
            }
        })
})

module.exports = router;