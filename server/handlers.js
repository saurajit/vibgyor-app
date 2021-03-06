var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./server/vibgyor.sqlite');

function getMembers(params) {
  var membersPromise,
    countTotalPromise,
    countRemainingPromise;
  
  membersPromise = new Promise(function (resolve, reject) {
    var responseObj;
    db.all("SELECT id, name, colour FROM members WHERE is_colour_set = 0 ORDER BY RANDOM() LIMIT ?", params, function cb(err, rows) {
      if (err) {
        responseObj = {
          'error': err
        };
        reject(responseObj);
      } else {
        responseObj = {
          statement: this,
          rows: rows
        };
        resolve(responseObj);
      }
    });
  });

  countTotalPromise = new Promise(function (resolve, reject) {
    var responseObj;
    db.all('SELECT count(*) as total FROM members', [], function (err, rows) {
      if (err) {
        responseObj = {
          'error': err
        };
        reject(responseObj);
      } else {
        responseObj = {
          statement: this,
          rows: rows
        };
        resolve(responseObj);
      }
    });
  });

  countRemainingPromise = new Promise(function (resolve, reject) {
    var responseObj;
    db.all('SELECT count(*) as notSet FROM members WHERE is_colour_set = ?', [0], function (err, rows) {
      if (err) {
        responseObj = {
          'error': err
        };
        reject(responseObj);
      } else {
        responseObj = {
          statement: this,
          rows: rows
        };
        resolve(responseObj);
      }
    });
  });

  return Promise.all([membersPromise, countRemainingPromise, countTotalPromise]);
}

function setMemberColours(members) {
  return new Promise(function (resolve, reject) {
    var responseObj;
    var stmt = db.prepare("UPDATE members set colour =? , is_colour_set = 1 WHERE id = ?");
    for (var i = 0; i < members.length; i++) {
      stmt.run(members[i].colour, members[i].id);
    }
    stmt.finalize(function cb(err, rows) {
      if (err) {
        responseObj = {
          'error': err
        };
        reject(responseObj);
      } else {
        responseObj = {
          statement: this,
          rows: rows
        };
        resolve(responseObj);
      }
    });
  });
}

function getResult() {
  return new Promise(function (resolve, reject) {
    var responseObj;
    db.all("SELECT id, name, colour FROM members WHERE is_colour_set = ? ORDER BY id", [1], function cb(err, rows) {
      if (err) {
        responseObj = {
          'error': err
        };
        reject(responseObj);
      } else {
        responseObj = {
          statement: this,
          rows: rows
        };
        resolve(responseObj);
      }
    });
  });
}

var Handlers = {
  retrieveMembers: function (memberCount) {
    return getMembers([memberCount]);
  },
  updateMembers: function (members) {
    return setMemberColours(members);
  },
  downloadResult: function () {
    return getResult();
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
