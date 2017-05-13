// content of index.js
var http = require('http-server');
var path = require('path');
var port = parseInt(process.argv[2], 10) || 3000;

var requestHandler = function (request, response) {
  console.dir(request);
  response.end(path.join(__dirname, 'public/index.html'));
};

var server = http.createServer(requestHandler);

server.listen(port, function(err)  {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log('server is listening on ' + port);
});