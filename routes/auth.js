const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config.json');

const User = require('../models/user.model'); 

router.post('/signup', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });

    newUser.save((err, user) => {
        if (err) res.send(err); 
        res.send(user);
    });
});

router.post('/login', (req, res) => {
    debugger;
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) res.send(err);
        if (user === null) {
            res.status(404).send(404);
        } else {
            if (user.password === req.body.password) {
                const token = jwt.sign(user, config.jwtSecret, { noTimestamp: true })
                res.json({
                    user,
                    token,
                    tokenType: 'Bearer'
                });
            } else {
                res.status(401).send(401);
            }
        }
    });
});

module.exports = router;