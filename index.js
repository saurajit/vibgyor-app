// server.js

// call the packages we need
var path = require('path');
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var port = parseInt(process.argv[2], 10) || 3000;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router
require('./server/apis')(router);

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.use(express.static(path.join(__dirname, '/public')));
// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
    if (req.url === '/favicon.ico') {
        res.end();
    } else {
        var err = new Error('Not Found');
        err.status = 404;
        res.json({ error: 'Invalid request' })
            .end();
        next(err);
    }
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server started at port ' + port);

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));