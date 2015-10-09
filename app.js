var express = require('express');
var app = express();

app.listen(3000, function() {
  console.log("Server listening on port 3000...");
});

// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/public/index.html');
// });

// Using the logger module
var logger = require('./logger');
app.use(logger);

// This is the Middleware that does the same thing as the commented code above.
app.use(express.static('public'));

var parties = {
  'party-1': ["Song 1", "Song 2", "Song 3"],
  'party-2': ["Song 4", "Song 5", "Song 6"],
  'party-3': ["Song 7", "Song 8", "Song 9"],
  'party-4': []
}; // This should be database query for that specific party id.

// Running pre-conditions on dynamic routes
app.param('name', function(request, response, next) {
  var name = request.params.name;
  var party = name.toLowerCase();
  request.partyName = party;
  next();
});

// Route to get the songs
app.get('/parties', function(req, res) { // This is going to be the party ID instead.
  if (req.query.limit >= 0) {
    res.json(Object.keys(parties.slice(0, req.query.limit)));
  }
  else {
    res.json(Object.keys(parties)); // Sending the parties to the client.
  }
});

app.get('/:name', function(request, response) {
  var songs = parties[request.partyName];
  if (!songs) {
    response.status(404).json('No party found with name ' + request.partyName);
  }
  else if (songs.length === 0) {
    response.json("This party has no songs...yet.");
  }
  else {
    response.json(songs);
  }
});