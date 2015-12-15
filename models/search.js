var mongoose = require('mongoose');

var SearchSchema = mongoose.Schema({
  search: String,
  value: Number,
  score: Number
});

module.exports = mongoose.model('Search', SearchSchema);
