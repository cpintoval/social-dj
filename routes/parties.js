var express = require('express');
var router = express.Router();

var parties = {
  'party-1': ['Song 1', 'Song 2', 'Song 3'],
  'party-2': ['Song 4', 'Song 5', 'Song 6']
};

/* GET parties listing. */
router.get('/', function(request, response, next) {
  response.render('parties', { parties: Object.keys(parties) });
});

router.get('/:name', function(request, response) {
  response.render('party', {
    name: request.params.name,
    songs: parties[request.params.name]
  });
});

module.exports = router;