const express = require('express');
const router = express.Router();

const Message = require('../models/message.model');

router.get('/', (req, res) =>{
    Message.find({})
    .populate('user', '-password')
    .exec((err, messages) =>{
        if(err) res.send(err);
        res.json(messages);
    })
})

router.get('/message/:id', (req, res) => {
    Message.findOne({ _id: req.params.id })
        .exec((err, message) => {
            if (err) res.send(err);
            res.status(200).json(message);
        });
});


module.exports = router;