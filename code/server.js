const http = require('http');
const express = require('express');
const path = require('path');
var fs = require('fs'),
  request = require('request');
const bodyParser = require('body-parser');
var exec = require('child_process').exec;

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("express"));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/', function(req, res) {
  var endpoint = req.body.endpoint;

  var download = function(uri, filename, callback) {
    request.get(uri, function(err, res, body) {
      if (res.headers['content-type'] != 'image/jpeg') {
        send_resp(res.body)
      } else {
        request(uri).pipe(fs.createWriteStream('public/' + filename)).on('close', callback);
      }
    });
  };

  function send_resp(body_val) {
    res.send(body_val)
  }
  download(endpoint, 'test.png', function() {
    console.log('done');
    res.send('test.png')
  });
})
app.use(express.static(__dirname + '/public'));
const server = http.createServer(app);
const port = 4560;
server.listen(port);
console.debug('Server listening on port ' + port);
