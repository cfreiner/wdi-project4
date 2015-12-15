var express = require('express');
var request = require('request');
var sentiment = require('sentiment');
var router = express.Router();
var mongoose = require('mongoose');
var Word = require('../models/word');
var Search = require('../models/search');
var async = require('async');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/wiki');
var url = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';

//Helper function to update the Mongo database when processing words
function incrementMongoWord(inputWord, valence) {
  Word.findOne(function(err, word) {
    console.log(word);
    if(err) {
      console.log(err);
    } else {
      if(word) {
        console.log(word);
        Word.findByIdAndUpdate(word.id, {value: word.value + 1}, function(err, word) {
          if(err) {
            console.log(err);
          } else {
            console.log('Updated: ', word.word, word.value);
          }
        });
      } else {
        var newWord = new Word(new WordNode(inputWord, valence));
        newWord.save(function(err) {
          if (err) {
            return res.send(err);
          }
        });
      }
    }
  });
}

router.get('/search', function(req, res) {
  var duplicateSearch = searchExists() ? true : false;
  console.log('Duplicate: ', duplicateSearch);

  request(url + req.query.q, function(err, response, body) {
    if(!err && response.statusCode == 200) {
      var text = getWikiText(JSON.parse(body));
      var processed = processSentiment(text);

      async.eachSeries(processed.words, function(item, callback) {
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
              var newWord = new Word(new WordNode(inputWord, valence));
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

      res.send(processed);
    }
  });

  //Helper function to tally the frequencies of an array of words.
  //Packages them into WordNode objects and adds them to Mongo if necessary.
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

});

//Determine if the search term is already in the db
function searchExists(searchTerm) {
  Search.findOne({'search': searchTerm}, function(err, result) {
    if (err) {
      console.log(err);
      return true;
    } else if(result) {
      console.log('SEARCHEXISTS RESULT: ', result);
      return true;
    } else {
      console.log('SEARCHEXISTS FALSE', result);
      return false;
    }
  });
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
