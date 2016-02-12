
var fs = require('fs');
var path = require('path');
var mkdirpSync = require('mkdirp').sync;
var sqlite3 = require('sqlite3');
var checkExists = require('./utils').checkExists;
var getConfig = require('../config').getConfig;

var SQLITE_DB_NAME = require('../constant').SQLITE_DB_NAME;
var CHANGELOG_TABLE_NAME = require('../constant').CHANGELOG_TABLE_NAME;
var TOKEN_TABLE_NAME = require('../constant').TOKEN_TABLE_NAME;

var createTableSqls = [
  'CREATE TABLE IF NOT EXISTS ' + CHANGELOG_TABLE_NAME + ' (' +
    'name TEXT UNIQUE NOT NULL,' +
    'migrations_dir TEXT NOT NULL,' +
    'run_on TEXT NOT NULL' +
  ');',
  'CREATE TABLE IF NOT EXISTS ' + TOKEN_TABLE_NAME + ' (' +
    'name TEXT UNIQUE NOT NULL,' +
    'token TEXT NOT NULL,' +
    'expired_at TEXT NOT NULL' +
  ');'
];

var inited = false;
var db;

exports.init = function(callback) {
  if (inited) {
    callback(db);
    return;
  };

  var config = getConfig();
  var dir = config.migrationsDatabase;
  var dbPath = path.join(dir, SQLITE_DB_NAME);
  if (!checkExists(dbPath)) {
    mkdirpSync(dir);
    fs.writeFileSync(dbPath, '');
  }

  db = new sqlite3.Database(dbPath);
  db.serialize(function() {
    createTableSqls.forEach(function(sql, index) {
      if (index === createTableSqls.length - 1) {
        db.run(sql, function() {
          inited = true;
          callback(db);
        });
      } else {
        db.run(sql);
      }
    });
  });
};

exports.close = function() {
  db.close();
};
