var models = require('../models');
var express = require('express');
var router = express.Router();
var session = require('express-session');
var sess;
var querystring = require('querystring');

var parties = {
  'party-1': ['Song 1', 'Song 2', 'Song 3'],
  'party-2': ['Song 4', 'Song 5', 'Song 6']
};

/* GET parties listing. */
router.get('/', function(request, response, next) {
  sess = request.session;
  if (sess.email){

    var ps = models.party.findAll().then(function(parties) {
      response.render('parties', {
        parties: parties,
        email: sess.email,
        password: sess.password 
      });
    });

  } else {

    response.redirect('/');
  }
});

router.get('/:id', function(request, response) {

    var partyID = request.params.id;

    models.party.find(partyID).then(function(party) {
      if (party) {
        models.song.findAll({
          where: {
            partyId: partyID
          }
        }).then(function(songs){
          
          response.render('party', {
            party: party,
            songs: songs
          });
        });
      }
      else {
        response.render('error', {
          message: 'This party does not exist',
          error: {
            status: '404',
            stack: 'Stack too deep'
          }
        });
      }
    });

  //   response.render('party', {
  //   name: request.params.name,
  //   songs: parties[request.params.name]
  // });
});

module.exports = router;