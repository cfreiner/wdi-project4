var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname + '/public'));

app.use('/api', require('./controllers/api.js'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on port ' + port);
});
