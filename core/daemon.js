var path = require('path');
var forever = require('forever');
var args = process.argv.slice(2);

module.exports = function(command) {
  if (!command) {
    command = 'start';
  }

  switch (command) {
    case 'start':
      startHttpServer();
      break;
    case 'stop':
      forever.stop(args[2]);
      break;
    case 'list':
      forever.list(true, function(err, list) {
        console.log(list);
      });
      break;
    case 'stopall':
      forever.stopAll(true);
      break;
  }
};

function startHttpServer() {
  forever.startDaemon(path.join(__dirname, 'server.js'), {
    max: 3,
    silent: false,
    args: args
  });
}
