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
  db.mysql.query(
    'CREATE TABLE `fun` ('+
      '`id` int(11) NOT NULL AUTO_INCREMENT,'+
      '`name` varchar(255) DEFAULT NULL,'+
      'PRIMARY KEY (`id`)'+
    ') ENGINE=InnoDB DEFAULT CHARSET=utf8;',
    callback
  );
};

/**
 * Add your down migrations code here
 */
exports.down = function(db, callback) {
  db.mysql.query(
    'DROP TABLE `fun`;',
    callback
  );
};
