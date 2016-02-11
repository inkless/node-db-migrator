var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var cwd = process.cwd();
var defaultConfig = exports.defaultConfig = {
  migrationsDir: path.join(cwd, 'migrations'),
  migrationsChangelog: path.join(cwd, 'db/migrations_changelog'),
  dbConfig: path.join(cwd, 'database.json')
};
var config = _.clone(defaultConfig);

exports.configure = function(newConfig) {
  _.extend(config, newConfig);
  verifyConfig(config);
  config.databases = require(config.dbConfig);

  if (!config.dbInUse) {
    if (config.databases.defaultDb) {
      config.dbInUse = [config.databases.defaultDb];
    } else if (_.size(config.databases) === 1) {
      for (var dbName in config.databases) {
        config.dbInUse = [dbName];
      }
    } else {
      config.dbInUse = _.keys(config.databases);
    }
  }
};

exports.getConfig = function() {
  return config;
};

function verifyConfig(config) {
  try {
    fs.statSync(config.dbConfig);
  } catch(e) {
    console.error('Cannot access to the database config!\nPlease verify your --db-config...');
    process.exit(1);
  }
}
