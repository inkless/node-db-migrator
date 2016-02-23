var _ = require('lodash');
var Promise = require('promise');
var config = require('../config');
var mysqlDriver = require('../driver/mysql');

var connections = {};
var drivers = {
  // TODO
  // add mongo and postgres etc here
  mysql: mysqlDriver
};

exports.connect = function(dbName) {
  var targetDb = getTargetDb(dbName);
  var driver = targetDb.driver;
  var driverConfig = _.omit(_.clone(targetDb), 'driver');

  if (!drivers[driver]) {
    throw new Error('No driver found for ' + driver);
  }

  var connection = drivers[driver].connect(driverConfig);
  connections[dbName] = connection;
  return connection;

};

var end = exports.end = function(dbName) {
  var targetDb = getTargetDb(dbName);
  return new Promise(function(resolve, reject) {
    if (!drivers[targetDb.driver]) {
      throw new Error('No driver found for ' + driver);
    }

    drivers[targetDb.driver].end(connections[dbName], function(err) {
      delete connections[dbName];
      resolve();
    });
  });
};

exports.endAll = function() {
  return Promise.all(_(connections).keys().map(function(dbName) {
    return end(dbName);
  }).value());
};

exports.getAllConnections = function() {
  return connections;
};

function getTargetDb(dbName) {
  return config.databases[dbName];
}
