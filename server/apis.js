var routes = function (routes) {
  var responseHandler = require('./handlers');

  routes.get('/', function (req, res) {
    res.json({ message: 'Horray! APIs working!' });
  });

  routes.route('/members/:count')
    .get(function (req, res) {
      var responseObj;
      responseHandler.retrieveMembers(req.params.count)
        .then(function (response) {
          responseObj = {
            members: response[0].rows,
            remaining: response[1].rows[0].notSet,
            total: response[2].rows[0].total
          }
          res.json({ result: responseObj, uri: req.route.path });
        })
        .catch(function (error) {
          res.status(400).json({ result: error, uri: req.route.path });
        });
    });

  routes.route('/members')
    .put(function (req, res) {
      responseHandler.updateMembers(req.body)
        .then(function (response) {
          res.json({ result: response, uri: req.route.path });
        })
        .catch(function (error) {
          res.status(400).json({ result: error, uri: req.route.path });
        });
    });

    routes.route('/download')
    .get(function (req, res) {
      responseHandler.downloadResult()
        .then(function (response) {
          if (req.query.output === 'csv') {
            var csv = require('express-csv');
            if(req.query.header === 'true') {
              response.rows.unshift({id: 'id', name: 'name', color: 'color'});
            }
            res.setHeader('Content-disposition', 'attachment; filename=members.csv');
            res.csv(response.rows);
          } else {
            res.json({result: response.rows, uri: req.originalUrl});
          }
        })
        .catch(function (error) {
          res.status(400).json({ result: error, uri: req.route.path });
        });
    });
};

module.exports = routes;