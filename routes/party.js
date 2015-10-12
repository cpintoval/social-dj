var express = require('express');
var router = express.Router();
var usersession = require('express-session');
var usersess;


/* GET users listing. */
router.get('/', function(req, res) {
  usersess = "replace me";
  console.log(usersess);
  res.render('party');
});


module.exports = router;