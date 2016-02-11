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
  db.mysql.query(`UPDATE employee SET sad_story = 'AAA' WHERE first_name = 'Sherlock';
  UPDATE employee SET sad_story = 'BBB' WHERE first_name = 'John';
  UPDATE employee SET sad_story = 'CCC' WHERE first_name = 'Joe';`, callback);
};

/**
 * Add your down migrations code here
 */
exports.down = function(db, callback) {
  db.mysql.query(`UPDATE employee SET sad_story = NULL WHERE first_name = 'Sherlock';
  UPDATE employee SET sad_story = NULL WHERE first_name = 'John';
  UPDATE employee SET sad_story = NULL WHERE first_name = 'Joe';`, callback);
};
