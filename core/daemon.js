var forever = require('forever-monitor');
var createServer = require('./server');

module.exports = function(command) {
  if (!command) {
    command = 'start';
  }

  switch (command) {
    case 'start':
      createServer();
      break;
    case 'stop':
      break;
  }
};
