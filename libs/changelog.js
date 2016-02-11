var fs = require('fs');
var path = require('path');
var mkdirpSync = require('mkdirp').sync;
var sqlite3 = require('sqlite3');
var checkExists = require('./utils').checkExists;
var getConfig = require('../config').getConfig;

var CHANGELOG_NAME = 'migrations_changelog.sqlt';
var CHANGELOG_TABLE_NAME = 'migrations';

var inited = false;
var changelogDb;
// prefetch logs for current migrationsDir
var allLogs;

exports.init = function(callback) {
  if (inited) return;

  var config = getConfig();
  var changelogDir = config.migrationsChangelog;
  var changelogPath = path.join(changelogDir, CHANGELOG_NAME);
  if (!checkExists(changelogPath)) {
    mkdirpSync(changelogDir);
    fs.writeFileSync(changelogPath, '');
  }

  changelogDb = new sqlite3.Database(changelogPath);
  changelogDb.run('CREATE TABLE IF NOT EXISTS ' + CHANGELOG_TABLE_NAME + ' (' +
    'name TEXT UNIQUE NOT NULL,' +
    'migrations_dir TEXT NOT NULL,' +
    'run_on TEXT NOT NULL' +
    ');',
    function(err, row) {
      inited = true;
      getAllLogs(config.migrationsDir, function(err, rows) {
        allLogs = rows;
        callback(err, row);
      });

    }
  );
};

exports.addLog = function(name, dir, callback) {
  changelogDb.run('INSERT INTO ' + CHANGELOG_TABLE_NAME + ' VALUES(?, ?, datetime("now"))', [name, dir], callback);
};

exports.removeLog = function(name, dir, callback) {
  changelogDb.run('DELETE FROM ' + CHANGELOG_TABLE_NAME + ' WHERE name = ? AND migrations_dir = ?', [name, dir], callback);
};

exports.getAllLogsFromCache = function() {
  return allLogs;
};

var getAllLogs = exports.getAllLogs = function(dir, callback) {
  changelogDb.all('SELECT * FROM ' + CHANGELOG_TABLE_NAME + ' WHERE migrations_dir = ?', dir, callback);
};

exports.close = function() {
  changelogDb.close();
};
