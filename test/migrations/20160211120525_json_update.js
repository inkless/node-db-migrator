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
  db.mysql.query('SELECT id,info FROM employee', [], function(err, rows) {

    if (err) {
      callback(err);
      return;
    }

    var ids = [];
    var newData = [];
    rows.forEach(function(row) {
      var info = row.info;
      info = JSON.parse(info);

      info.newBar = 'new-' + info.bar;

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

/**
 * Add your down migrations code here
 */
exports.down = function(db, callback) {
  db.mysql.query('SELECT id,info FROM employee', [], function(err, rows) {

    if (err) {
      callback(err);
      return;
    }

    var ids = [];
    var newData = [];
    rows.forEach(function(row) {
      var info = row.info;
      info = JSON.parse(info);

      delete info.newBar;

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
