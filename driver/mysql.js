var mysql = require('mysql');

exports.connect = function(config) {
  var connection = mysql.createConnection(config);
  connection.connect();
  return connection;
};

exports.end = function(driver, callback) {
  driver.end(callback);
};
