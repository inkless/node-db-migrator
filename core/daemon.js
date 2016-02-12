var path = require('path');
var forever = require('forever');
var args = process.argv.slice(2);

module.exports = function(command) {
  if (!command) {
    command = 'start';
  }

  switch (command) {
    case 'start':
      startDaemon(path.join(__dirname, 'server.js'));
      startDaemon(path.join(__dirname, 'kafka.js'));
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

function startDaemon(path) {
  console.log('Starting daemon: ' + path);
  forever.startDaemon(path, {
    max: 3,
    silent: false,
    args: args
  });
}
