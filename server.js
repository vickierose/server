const express = require('express'),
      app = express(),
      http = require('http').Server(app),
      bodyParser = require('body-parser'),
      fileUpload = require('express-fileupload'),
      mongoose = require('mongoose'),
      cors = require('cors'),
      morgan = require('morgan');
      jwt = require('jsonwebtoken'),
      io = require('socket.io')(http),
      ioJwt = require('socketio-jwt'),
      config = require('./config.json'),
      port = process.env.PORT || 3000;

const Message = require('./models/message.model');

mongoose.connect('mongodb://vickie:13reasons@ds129641.mlab.com:29641/chatdb');
const db = mongoose.connection;

const auth = require('./routes/auth');
const users = require('./routes/users');
const chat = require('./routes/chat');

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('tiny'));

app.use('/auth', auth);
app.use('/users', users);
app.use('/chat', chat);

app.use(express.static('public'));

io.sockets
  .on('connection', ioJwt.authorize({
    secret: config.jwtSecret,
    callback: false
  }))
  .on('authenticated', socket => {
    io.emit('join', {
      user: socket.decoded_token._doc ? socket.decoded_token._doc : socket.decoded_token,
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
      const msgObj = {
        msg,
        user: socket.decoded_token._doc ? socket.decoded_token._doc : socket.decoded_token
      }

      io.emit('message', msgObj)
          const msgObjToSave = new Message({
            msg: msgObj.msg,
            user: msgObj.user._id
          })
          msgObjToSave.save((err, message) => {
          if (err) console.log(err);
            });
  }

    function disconnectHandler() {
      io.emit('leave', {
        user: socket.decoded_token._doc ? socket.decoded_token._doc : socket.decoded_token,
        time: Date.now()
      })
    }
  })

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, () => {
    console.log(`server is running on localhost:` + port)
});