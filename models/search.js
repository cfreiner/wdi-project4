var mongoose = require('mongoose');

var SearchSchema = mongoose.Schema({
  search: String,
  value: Number
});

module.exports = mongoose.model('Search', SearchSchema);
