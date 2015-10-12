var express = require('express');
var router = express.Router();
var session = require('express-session');
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

// router.get('/admin', function(req, res){
//   if (sess.email){
//     res.render('parties', { 
//         title: 'HeyDJ',
//         email: sess.email,
//         password: sess.password
//          });
//   } else {
//     res.redirect('/');
//   }
// });

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
  sess.email = request.body.email;
  sess.password = request.body.password;
  response.end('done');
});

module.exports = router;
