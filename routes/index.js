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
    response.render('index', {title: 'Login page'});
  }
});

router.get('/logout', function(request, response){
  request.session.destroy(function(err){
    if (err){
      console.log(err);
    } else {
      response.redirect('/');
    }
  })
});

router.post('/', function(request,response){
  sess = request.session;
  
  models.dj.findAll({
    where: {
      email: request.body.email
    }
  }).then(function(res){

    if (res[0].dataValues.password === request.body.password){
      sess.email = request.body.email;
      sess.password = request.body.password;
      response.end('done');
    } else {
      response.status(500).send({error: 'Something blew up!'});
    }
  })
});

module.exports = router;
