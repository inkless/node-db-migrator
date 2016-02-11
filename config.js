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

  var databases = getDatabases();
  if (!config.dbInUse) {
    if (databases.defaultDb) {
      config.dbInUse = [databases.defaultDb];
    } else if (_.size(databases) === 1) {
      for (var dbName in databases) {
        config.dbInUse = [dbName];
      }
    } else {
      config.dbInUse = _.keys(databases);
    }
  }
};

exports.getConfig = function() {
  return config;
};

var getDatabases = exports.getDatabases = function() {
  if (!config.databases) {
    config.databases = require(config.dbConfig);
  }
  return config.databases;
};

function verifyConfig(config) {
  try {
    fs.statSync(config.dbConfig);
  } catch(e) {
    console.error('Cannot access to the database config!\nPlease verify your --db-config...');
    process.exit(1);
  }
}
