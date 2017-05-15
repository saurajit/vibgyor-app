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

function setMemberColours (members) {
  return new Promise(function (resolve, reject) {
    var responseObj;
    var stmt = db.prepare("UPDATE members set colour =? , is_colour_set = 1 WHERE id = ?");
    for (var i = 0; i < members.length; i++) {
        stmt.run(members[i].colour, members[i].id);
    }
    stmt.finalize(function cb(err, rows) {
      console.log(err, rows);
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
    return getMembers("SELECT id, name, colour FROM members WHERE is_colour_set = 0 ORDER BY RANDOM() LIMIT ?", [memberCount]);
  },
  updateMembers: function (members) {
    return setMemberColours(members);
  }
};

module.exports = Handlers;

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
  db.close();
  if (options.cleanup) console.log('DB closed');
  if (err) console.log(err.stack);
  if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
