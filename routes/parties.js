var models = require('../models');
var express = require('express');
var router = express.Router();
var session = require('express-session');
var sess;
var querystring = require('querystring');

/* GET parties listing. */
router.get('/', function(request, response, next) {
  sess = request.session;

  models.dj.findOne({
    where: {
      email: sess.email
    }}).then(function(dj){

      if (sess.email){
        models.party.findAll({
          where: {
            djId: dj.dataValues.id
          }
        }).then(function(parties) {
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
});

router.post('/', function(request, response){
  sess = request.session;

  models.dj.findOne({
    where: {
      email: sess.email
    }
  }).then(function(dj){
      models.party.create({
        name: request.body.partyName,
        active: true,
        djId: dj.id
      }).then(function(party){
        response.send(party);
      });
    });
});

router.post('/archive',function(request,response){
  var partyId = request.body.partyid;
  models.party.update({
    active: false,
    }, {
    where: {
      id: partyId
    }
  }).then(function(data){

    models.party.findOne({
      where: {
        id: request.body.partyid
      }
    }).then(function(party){

    response.send(party);
    })
  });
});

router.post('/remove',function(request,response){
  var partyId = request.body.partyid;
  models.party.destroy({
    where: {
      id: partyId
    }
  }).then(function(data){
    response.send("removed");
  });
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
            stack: 'Stack level waaay too deep'
          }
        });
      }
    });

});

router.get('/:id/dj', function(request, response) {

    var partyID = request.params.id;

    models.party.find(partyID).then(function(party) {
      if (party) {
        models.song.findAll({
          where: {
            partyId: partyID
          }
        }).then(function(songs){

          response.render('dashboard', {
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
            stack: 'Stack level waaay too deep'
          }
        });
      }
    });

});


module.exports = router;