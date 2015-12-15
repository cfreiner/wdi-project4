var mongoose = require('mongoose');

var WordSchema = mongoose.Schema({
  word: String,
  valence: String,
  value: Number
});

module.exports = mongoose.model('Word', WordSchema);
