/**
 * Connect to database
 */
exports.connect = function(dbConnect) {
  dbConnect.connect("mysql");
  dbConnect.connect("mysql2");
};

/**
 * Add your up migrations code here
 */
exports.up = function(db, callback) {
  db.mysql2.query(
    'CREATE TABLE `stories` ('+
      '`id` int(11) NOT NULL AUTO_INCREMENT,'+
      '`story` TEXT DEFAULT NULL,'+
      'PRIMARY KEY (`id`)'+
    ') ENGINE=InnoDB DEFAULT CHARSET=utf8;',
    function() {
      db.mysql.query('SELECT sad_story from employee', function(err, rows) {
        var sqls = 'INSERT INTO stories (story) VALUES ' +
          rows.map(function(row) {
            return '("' + row.sad_story + '")';
          }).join(',') + ';';

        console.log(sqls);

        db.mysql2.query(sqls, callback);
      });
    }
  );
};

/**
 * Add your down migrations code here
 */
exports.down = function(db, callback) {
  db.mysql2.query('DROP TABLE `stories`;', callback);
};
