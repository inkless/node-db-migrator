var randomstring = require("randomstring");
var sqltDb = require('./sqlt_db');
var TOKEN_TABLE_NAME = require('../constant').TOKEN_TABLE_NAME;

var db;

exports.init = function(callback) {
  sqltDb.init(function(database) {
    db = database;
    callback();
  });
};

exports.createToken = function(name, callback) {
  db.run('INSERT INTO ' + TOKEN_TABLE_NAME + ' VALUES(?, ?, datetime("now", "+1 month"))', [name, randomstring.generate()], callback);
};

exports.removeToken = function(name, callback) {
  db.run('DELETE FROM ' + TOKEN_TABLE_NAME + ' WHERE name = ?', [name], callback);
};

exports.getToken = function(token, callback) {
  db.get('SELECT * FROM ' + TOKEN_TABLE_NAME + ' WHERE token = ?', [token], callback);
};

exports.close = function() {
  sqltDb.close();
};
