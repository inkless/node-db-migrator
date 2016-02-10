var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('pets', {
    columns: {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      name: 'string'  // shorthand notation
    },
    ifNotExists: true
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('pets', {
    ifExists: true
  }, callback);
};
