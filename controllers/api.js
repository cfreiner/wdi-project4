var express = require('express');
var request = require('request');
var sentiment = require('sentiment');
var router = express.Router();

var url = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';

router.get('/search', function(req, res) {
  request(url + req.query.q, function(err, response, body) {
    if(!err && response.statusCode == 200) {
      res.send(body);
    }
  });
});

router.get('/test', function(req, res) {
  var s = processSentiment('Hello hello good Good bad bad bad Bad evil Evil happy');
  res.send(s);
});

function processSentiment(text) {
  var analyzed = sentiment(text);
  var output = {
    score: analyzed.score,
    comparative: analyzed.comparative.toFixed(2),
    words: []
  };
  addWords(analyzed.positive, output.words, 'positive');
  addWords(analyzed.negative, output.words, 'negative');
  return output;
}

function addWords(inputArr, outputArr, valence) {
  for(var i = 0; i < inputArr.length; i++) {
    var found = false;
    for(var j = 0; j < outputArr.length; j++) {
      if(inputArr[i] === outputArr[j].word) {
        outputArr[j].frequency += 1;
        found = true;
        break;
      }
    }
    if(!found) {
      outputArr.push(new WordNode(inputArr[i], valence));
    }
  }
}

function WordNode(word, valence) {
  this.word = word;
  this.valence = valence;
  this.frequency = 1;
}

module.exports = router;
