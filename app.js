var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000, function() {
  console.log("Server listening on port 3000...");
});


// Using the logger module
var logger = require('./logger');
app.use(logger);

var parties = require('./routes/parties');
app.use('/parties', parties);

// app.get('/', function(request, response) {
//   response.sendFile(__dirname + '/public/index.html');
// });

// This is the Middleware that does the same thing as the commented code above.
app.use(express.static('public'));

io.on('connection', function(socket) {
  console.log('user connected');
});