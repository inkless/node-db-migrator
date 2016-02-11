/**
 * Connect to database
 */
exports.connect = function(dbConnect) {
  dbConnect.connect("mysql");
};

/**
 * Add your up migrations code here
 */
exports.up = function(db, callback) {
  callback();
};

/**
 * Add your down migrations code here
 */
exports.down = function(db, callback) {
  callback();
};
