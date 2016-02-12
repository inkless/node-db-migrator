/**
 * Connect to database
 */
exports.connect = function(dbConnect) {
  dbConnect.connect("mysql");
};

/**
 * Add your migrations triggering code here
 */
exports.trigger = function(db, params, callback) {
  var firstName = params.firstName;
  db.mysql.query('SELECT id,info FROM employee WHERE first_name = ?', [firstName], function(err, rows) {
    var ids = [];
    var newData = [];
    rows.forEach(function(row) {
      var info = row.info;
      info = JSON.parse(info);

      info.newFoo = 'new-' + info.foo;

      ids.push(row.id);
      newData.push(JSON.stringify(info));
    });

    ids.forEach(function(id, index) {
      var cb = function() {};
      if (index === ids.length - 1) {
        cb = callback;
      }
      db.mysql.query('UPDATE employee SET info = ? WHERE id = ?', [newData[index], id], cb);
    });
  });
};
