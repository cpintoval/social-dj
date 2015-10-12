var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });
var path = require('path');

var parties = {
  'party-1': ["Song 1", "Song 2", "Song 3"],
  'party-2': ["Song 4", "Song 5", "Song 6"],
  'party-3': ["Song 7", "Song 8", "Song 9"],
  'party-4': []
}; // This should be database query for that specific party id.

router.route('/')
  .get(function(request, response) { // This is going to be the party ID instead.
    if (request.query.limit >= 0) {
      response.json(Object.keys(parties.slice(0, request.query.limit)));
    }
    else {
      response.json(Object.keys(parties)); // Sending the parties to the client.
    }
  })
  .post(parseUrlencoded, function(request, response) {
    var newParty = request.body;
    parties[newParty.name] = []; // Adding to the database
    response.status(201).json(newParty.name);
  });

router.route('/:name')
  // Running pre-conditions on dynamic routes
  .all(function(request, response, next) {
    var name = request.params.name;
    var party = name.toLowerCase();
    request.partyName = party;
    next();
  })
  .get(function(request, response) {
    var songs = parties[request.partyName];
    if (!songs) {
      response.status(404).json('No party found with name ' + request.partyName);
    }
    else {
      // response.json(songs);
      response.sendFile(path.resolve('public/party-user.html'));
    }
  })
  .delete(function(request, response) {
    delete parties[request.partyName];
    response.sendStatus(200);
  });

router.route('/:name/songs')
  // Running pre-conditions on dynamic routes
  .all(function(request, response, next) {
    var name = request.params.name;
    var party = name.toLowerCase();
    request.partyName = party;
    next();
  })
  .get(function(request, response) {
    var songs = parties[request.partyName];
    if (!songs) {
      response.status(404).json('No party found with name ' + request.partyName);
    }
    else {
      response.json(songs);
    }
  });



module.exports = router;