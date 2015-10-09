var express = require('express');
var app = express();

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


app.listen(3000, function() {
  console.log("Server listening on port 3000...");
});