var express = require('express');
var request = require('request');
var sentiment = require('sentiment');
var router = express.Router();
var Word = require('../models/word');
var Search = require('../models/search');

var url = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';

router.get('/search', function(req, res) {
  request(url + req.query.q, function(err, response, body) {
    if(!err && response.statusCode == 200) {
      var text = getWikiText(JSON.parse(body));
      res.send(processSentiment(text));
    }
  });
});

//Pull just the content of the Wikipedia page
function getWikiText(wikiJSON) {
  result = '';
  var pages = wikiJSON.query.pages;
  for(var key in pages) {
    result += pages[key].revisions[0]['*'];
  }
  return result;
}

//Return an object of work frequencies
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

//Tally the frequencies of an array of words.
//Package them into WordNode objects
function addWords(inputArr, outputArr, valence) {
  for(var i = 0; i < inputArr.length; i++) {
    var found = false;
    for(var j = 0; j < outputArr.length; j++) {
      if(inputArr[i] === outputArr[j].word) {
        outputArr[j].value += 1;
        found = true;
        break;
      }
    }
    if(!found) {
      outputArr.push(new WordNode(inputArr[i], valence));
    }
  }
}

//Class for storing words and frequencies
function WordNode(word, valence) {
  this.word = word;
  this.valence = valence;
  this.value = 1;
}

module.exports = router;
