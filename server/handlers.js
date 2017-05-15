var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./server/vibgyor.sqlite');

function getMembers(sql, params) {
  return new Promise(function (resolve, reject) {
    var responseObj;
    db.all(sql, params, function cb(err, rows) {
      if (err) {
        responseObj = {
          'error': err
        }
        reject(responseObj);
      } else {
        responseObj = {
          statement: this,
          rows: rows
        }
        resolve(responseObj);
      }
    });
  });
}

var Handlers = {
  retrieveMembers: function (memberCount) {
    return getMembers("SELECT id, name, colour FROM members ORDER BY RANDOM() LIMIT ?", [memberCount]);
  },
  updateMembers: function (memberCount) {
    return {
      'message': 'Requested updating of` members'
    };
  }
};

module.exports = Handlers;

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
  db.close();
  if (options.cleanup) console.log('Handler clean');
  if (err) console.log(err.stack);
  if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
