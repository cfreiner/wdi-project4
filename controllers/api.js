var express = require('express');
var request = require('request');
var sentiment = require('sentiment');
var router = express.Router();
var mongoose = require('mongoose');
var Word = require('../models/word');
var Search = require('../models/search');
var async = require('async');
var groups = require('./groups');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/wiki');
var url = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';

router.get('/words', function(req, res) {
  Word.find({}).sort({value: -1}).limit(200).exec(function(err, words) {
    if(err) {
      return res.status(500).send(err);
    } else {
      res.send(words);
    }
  });
});

router.get('/group/:name', function(req, res) {
  var group = groups[req.params.name];
  var scores = [];
  async.each(group, function(item, callback) {
    Search.findOne({search: item}, function(err, result) {
      if(err) {
        return res.status(500).send(err);
      } else {
        scores.push(result);
        callback();
      }
    });
  }, function(err) {
    if(err) {
      return res.status(500).send(err);
    } else {
      res.send(scores);
    }
  });
});

router.get('/search', function(req, res) {
  request(url + req.query.q, function(err, response, body) {
    function storeWords() {
      var pos = analyzed.positive.map(function(item) {
        return new WordNode(item, 'positive');
      });
      var neg = analyzed.negative.map(function(item) {
        return new WordNode(item, 'negative');
      });
      var toStore = pos.concat(neg);
      //Process the words in sequence and store them in the database if necessary
      async.eachSeries(toStore, function(item, callback) {
        //Check for word in mongo
        //If found, increment, if not, create
        Word.findOne({word: item.word}, function(err, word) {
          if(err) {
            console.log(err);
            callback(err);
          } else {
            if(word) {
              console.log('Found word:', word);
              Word.findByIdAndUpdate(word.id, {value: word.value + 1}, function(err, word) {
                if(err) {
                  console.log(err);
                  callback(err);
                } else {
                  console.log('Updated: ', word.word, word.value);
                  callback();
                }
              });
            } else {
              var newWord = new Word(new WordNode(item.word, item.valence));
              newWord.save(function(err) {
                if (err) {
                  return res.send(err);
                }
                callback();
              });
            }
          }
        });
      }, function(error) {
        if(error) {
          console.log('Async Error: ', error);
        } else {
          console.log('Async series completed successfully.');
        }
      });
    } //End store function

    if(!err && response.statusCode == 200) {
      var parsed = JSON.parse(body);
      var pages = parsed.query.pages;
      if(pages['-1']) {
        return res.status(400).send();
      }
      for(var key in pages) {
        if(pages[key].revisions[0]['*'].substr(0,9) === '#REDIRECT' || pages[key].revisions[0]['*'].substr(0,100).indexOf('may refer to') !== -1) {
          return res.status(400).send();
        }
      }
      var text = getWikiText(parsed);
      var analyzed = sentiment(text);
      var processed = processSentiment(analyzed);

      Search.findOne({search: req.query.q}, function(err, result) {
        if (err) {
          console.log(err);
        } else if(result) {
          //Increment the search counter, but don't increment add words
          Search.findByIdAndUpdate(result.id, {value: result.value + 1}, function(err, search) {
            if(!err) {
              console.log('Successfully incremented search value: ', search.search, search.value);
            }
          });
          console.log('SEARCHEXISTS TRUE: ', result);
        } else {
          Search.create({
            search: req.query.q,
            value: 1,
            score: analyzed.score
          }, function(err, newSearch) {
            console.log('Added new search: ', newSearch.search);
          });
          //Only hit my DB to store words if it is a new search
          storeWords();
          console.log('SEARCHEXISTS FALSE', result);
        }
      });
      console.log('WORDS LENGTH: ', processed.words.length);
      res.send(processed);
    } else {
      res.send('Wikimedia request failed: ', response.statusCode);
    }
  });
});

//Helper function to tally the frequencies of an array of words.
//Packages them into WordNode objects. Doesn't touch the DB.
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

//Return an object of word frequencies
//Takes output from Sentiment module
function processSentiment(analyzed) {
  var output = {
    score: analyzed.score,
    comparative: analyzed.comparative.toFixed(2),
    words: []
  };
  addWords(analyzed.positive, output.words, 'positive');
  addWords(analyzed.negative, output.words, 'negative');
  return output;
}

//Pull just the content of the Wikipedia page
function getWikiText(wikiJSON) {
  result = '';
  var pages = wikiJSON.query.pages;
  for(var key in pages) {
    result += pages[key].revisions[0]['*'];
  }
  return result;
}

//Class for storing words and frequencies
function WordNode(word, valence) {
  this.word = word;
  this.valence = valence;
  this.value = 1;
}

module.exports = router;
