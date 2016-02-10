var migratorCore = {
  version: require('../package.json').version
};

migratorCore.configure = function() {

};

migratorCore.create = require('./create');


module.exports = migratorCore;
