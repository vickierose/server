const express = require('express'),
      app = express(),
      http = require('http').Server(app),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      cors = require('cors'),
      morgan = require('morgan');
      jwt = require('jsonwebtoken'),
      io = require('socket.io')(http),
      ioJwt = require('socketio-jwt'),
      config = require('./config.json');

const Message = require('./models/message.model');

mongoose.connect('mongodb://localhost/chatdb');
const db = mongoose.connection;

const auth = require('./routes/auth');
const users = require('./routes/users');
const chat = require('./routes/chat');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('tiny'));

app.use('/auth', auth);
app.use('/users', users);
app.use('/chat', chat);

io.sockets
  .on('connection', ioJwt.authorize({
    secret: config.jwtSecret,
    callback: false
  }))
  .on('authenticated', socket => {
    io.emit('join', {
      user: socket.decoded_token._doc,
      time: Date.now()
    })
    socket
      .on('unauthorized', unauthorizedHandler)
      .on('message', chatMessageHandler)
      .on('disconnect', disconnectHandler)

    function unauthorizedHandler(error) {
      if (error.data.type == 'UnauthorizedError' || error.data.code == 'invalid_token') {
        console.log("User's token has expired");
      }
    }

    function chatMessageHandler(msg) {
      const msgObj = new Message ({
        msg,
        user: socket.decoded_token._doc,
      })

      console.log(msgObj);

      io.emit('message', msgObj)
                msgObj.save((err, message) => {
                if (err) console.log(err);
            });
  }

    function disconnectHandler() {
      io.emit('leave', {
        user: socket.decoded_token,
        time: Date.now()
      })
    }
  })

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// io.on('connection', socket => {
//     console.log('connected to sockets')
// });

http.listen(3000, () => {
    console.log(`server is running on localhost:3000`)
});