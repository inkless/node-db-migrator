module.exports = {
  version: require('../package.json').version,
  configure: require('../config').configure,
  create: require('./create'),
  up: require('./run').up,
  down: require('./run').down,
  daemon: require('./daemon')
};
