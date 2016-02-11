var mysql = require('mysql');
var mongodb = require('mongodb');
var getConfig = require('../config').getConfig;

var connections = {};

exports.connect = function(dbName) {
  var targetDb = getTargetDb(dbName);
  var driver = targetDb.driver;
  _.omit(targetDb, 'driver');

  var connection;
  switch (driver) {
    case 'mysql':
      connection = connectMysql(targetDb);
      break;
    case 'mongodb':
      // TODO
      break;
  }
  connections[dbName] = connection;
  return connection;
};

exports.end = function(dbName) {
  var targetDb = getTargetDb(dbName);
  switch (driver) {
    case 'mysql':
      connections[dbName].end();
      break;
    case 'mongodb':
      // TODO
      break;
  }
};

exports.getAllConnections = function() {
  return connections;
};

function getTargetDb(dbName) {
  var databases = getConfig().databases;
  return databases[dbName];
}

function connectMysql(config) {
  var connection = mysql.createConnection(config);
  connection.connect();
  return connection;
}
