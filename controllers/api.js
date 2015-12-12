var express = require('express');
var request = require('request');
var router = express.Router();

var url = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';

router.get('/search', function(req, res) {
  request(url + req.query.q, function(err, response, body) {
    if(!err && response.statusCode == 200) {
      res.send(body);
    }
  });
});

module.exports = router;
