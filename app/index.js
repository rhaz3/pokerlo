var express = require('express');
const path = require('path');
var app = express();
app.use(express.static('src'));
app.use(express.static('../contract/build/contracts'));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "./src/index.html"));
});
var port = process.env.PORT || 3000;
var host = '0.0.0.0';
app.listen(port, host, function() {
  console.log('POKERLO listening on port 3000')
});
