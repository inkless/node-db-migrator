var restify = require('restify');
var config = require('../config');
var token = require('../libs/token');
var trigger = require('./run').trigger;

var server = restify.createServer({
  name: 'migration daemon'
});
server.use(restify.queryParser());
server.get('/trigger-migrate', triggerMigrate);
server.listen(config.port , function() {
  console.log('%s listening at %s', server.name, server.url);
});

function triggerMigrate(req, res, next) {
  if (!req.params.token) {
    return next(new restify.errors.BadRequestError('no token specified.'));
  }

  token.init(function() {
    token.getToken(req.params.token, function(err, data) {
      if (!data) {
        return next(new restify.errors.UnauthorizedError('invalid token.'));
      }
      trigger(data.name, req.params);
      res.send('Migrating ' + data.name + ' with params: ' + JSON.stringify(req.params));
      next();
    });
  });

}
