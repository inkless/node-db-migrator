var mysql = require('mysql');
var mongodb = require('mongodb');
var _ = require('lodash');
var Promise = require('promise');
var config = require('../config');

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

  var ori = _.size(connections);
  connections[dbName] = connection;
  return connection;
};

var end = exports.end = function(dbName) {
  var targetDb = getTargetDb(dbName);
  return new Promise(function(resolve, reject) {
    switch (targetDb.driver) {
      case 'mysql':
        connections[dbName].end(function(err) {
          delete connections[dbName];
          resolve();
        });
        break;
      case 'mongodb':
        // TODO
        break;
    }
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

function connectMysql(config) {
  var connection = mysql.createConnection(config);
  connection.connect();
  return connection;
}
