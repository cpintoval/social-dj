var express = require('express');
var router = express.Router();
var session = require('express-session');
var models = require("../models");
var sess;


/* GET home page. */
router.get('/', function(request, response) {
  sess = request.session;

  if (sess.email){
    response.redirect('/parties');
  } else {
    response.render('index');
  }
});

router.get('/logout', function(request, response){
  request.session.destroy(function(err){
    if (err){
      console.log(err);
    } else {
      response.redirect('/');
    }
  });
});

router.post('/goto', function(request, response){

  models.party.findOne({
    where: {
      id: request.body.partyCode
    }
  }).then(function(goToParty){
    if (goToParty){
     if (goToParty.active){
      response.send(goToParty);
      }
    }
  });
});

router.post('/', function(request,response) {
  sess = request.session;

  models.dj.findAll({
    where: {
      email: request.body.email
    }
  }).then(function(res){
    if (res.length !== 0){

      if (res[0].dataValues.password === request.body.password){
        sess.email = request.body.email;
        sess.password = request.body.password;
        response.end('done');
      } else {
        response.send({message: 'The password did not match!'});
      }

    } else {
      response.send({message: 'A dj account with the email you provided does not exist!'});
    }
  }).catch(function(e) {
    console.log(e, "login");
  });
});

router.post('/signup', function(request,response){
  sess = request.session;

  models.dj.findAll({
    where: {
      email: request.body.email
    }
  }).then(function(res){

    if (res.length !== 0){

      response.send({message: 'A DJ with that email already exists! Please signin or signup with a different email!'});

    } else {

      sess.email = request.body.email;
      sess.password = request.body.password;

      models.dj.create({
        name: request.body.name,
        password: request.body.password,
        email: request.body.email
      }).then(response.end('done'));
    }
  }).catch(function(e){
    console.log(e, "signup");
  });
});

module.exports = router;
