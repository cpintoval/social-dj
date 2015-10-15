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
      console.log(err); //TODO: use console.error, what is the response to the user if a failure occurs
    } else {
      response.redirect('/');
    }
  })
});

router.post('/', function(request,response){
  sess = request.session;

  //function(err,data) Node style callback
  
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
  }) //TODO: You are missing error handling on promises. Take a look at using catch or how to handle errors with Sequelize


  //doSomethingThatReturnsAPromise.then(successFunction).catch(failureFunction)

  //doSomethingThatReturnsAPromise.then(successFunction,failureFunction)

});

router.post('/signup', function(request,response){ //TODO: You can simplify these to be req,res instead
  sess = request.session;

  models.dj.findAll({
    where: {
      email: request.body.email
    }
  }).then(function(res){ //TODO: maybe just use 'data' or something else

    if (res.length !== 0){
      
      response.send({message: 'A DJ with that email already exists! Please signin or signup with a different email!'});

    } else {

      sess.email = request.body.email;
      sess.password = request.body.password;

      models.dj.create({
        name: request.body.name,
        password: request.body.password,
        email: request.body.email
      }).then(response.end('done')); //TODO: Does this actually work? Just curious.
    }
  })
});

module.exports = router;
