var routes = function (routes) {
  var responseHandler = require('./handlers');

  routes.get('/', function (req, res) {
    res.json({ message: 'Horray! APIs working!' });
  });

  routes.route('/members/:count')

    .get(function (req, res) {
      responseHandler.retrieveMembers(req.params.count)
        .then(function (response) {
          res.json({ result: response.rows, uri: req.route.path });
        })
        .catch(function (error) {
          res.status(400).json({ result: error, uri: req.route.path });
        });
    })

    .put(function (req, res) {
      responseHandler.updateMembers(req.body);
      res.json({ result: response, uri: req.route.path });
      // responseHandler.updateMembers(req.params.itemId, req.body)
      //   .then(function (response) {
      //     res.json({ result: response, uri: req.route.path });
      //   })
      //   .catch(function (error) {
      //     res.status(400).json({ result: error, uri: req.route.path });
      //   });
    });
};

module.exports = routes;