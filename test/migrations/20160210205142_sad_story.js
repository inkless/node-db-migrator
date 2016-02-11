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
  db.mysql.query('ALTER TABLE employee ADD COLUMN `sad_story` TEXT;', callback);
};

/**
 * Add your down migrations code here
 */
exports.down = function(db, callback) {
  db.mysql.query('ALTER TABLE employee DROP COLUMN `sad_story`;', callback);
};
