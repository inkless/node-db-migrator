var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql('select id,info from employee', [], function(err, result) {

    if (err) {
      callback(err);
      return;
    }

    var ids = [];
    var newData = [];
    result.forEach(function(row) {
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
      db.runSql('update employee set info = ? where id = ?', [newData[index], id], cb);
    });
  });
};

exports.down = function(db, callback) {
  db.runSql('select id,info from employee', [], function(err, result) {

    if (err) {
      callback(err);
      return;
    }

    var ids = [];
    var newData = [];
    result.forEach(function(row) {
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
      db.runSql('update employee set info = ? where id = ?', [newData[index], id], cb);
    });
  });
};
