var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var checkExists = require('./libs/utils').checkExists;
var CONSTANT = require('./constant');

var cwd = process.cwd();
var config = {
  migrationsDir: CONSTANT.DEFAULT_MIGRATIONS_DIR,
  migrationsDatabase: CONSTANT.DEFAULT_MIGRATIONS_DATABASE,
  dbConfig: CONSTANT.DEFAULT_DB_CONFIG,
  port: CONSTANT.DEFAULT_PORT
};

exports.configure = function(newConfig) {
  _.extend(config, newConfig);
  if (!checkExists(config.dbConfig)) {
    console.error('Cannot access to the database config!\nPlease verify your --db-config...');
    process.exit(1);
  }

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
