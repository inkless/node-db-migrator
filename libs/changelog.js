var getConfig = require('../config').getConfig;
var sqltDb = require('./sqlt_db');
var CHANGELOG_TABLE_NAME = require('../constant').CHANGELOG_TABLE_NAME;

var db;
// prefetch logs for current migrationsDir
var allLogs;

exports.init = function(callback) {
  sqltDb.init(function(database) {
    db = database;

    getAllLogs(getConfig().migrationsDir, function(err, rows) {
      allLogs = rows;
      callback();
    });
  });
};

exports.addLog = function(name, dir, callback) {
  db.run('INSERT INTO ' + CHANGELOG_TABLE_NAME + ' VALUES(?, ?, datetime("now"))', [name, dir], callback);
};

exports.removeLog = function(name, dir, callback) {
  db.run('DELETE FROM ' + CHANGELOG_TABLE_NAME + ' WHERE name = ? AND migrations_dir = ?', [name, dir], callback);
};

exports.getAllLogsFromCache = function() {
  return allLogs;
};

var getAllLogs = exports.getAllLogs = function(dir, callback) {
  db.all('SELECT * FROM ' + CHANGELOG_TABLE_NAME + ' WHERE migrations_dir = ?', dir, callback);
};

exports.close = function() {
  sqltDb.close();
};
