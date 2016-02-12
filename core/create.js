var fs = require('fs');
var path = require('path');
var mkdirpSync = require('mkdirp').sync;

var config = require('../config');
var utils = require('../libs/utils');
var token = require('../libs/token');

module.exports = function(migrationName, templatePath, folder, type) {
  var filename = utils.generateFilename(migrationName);
  utils.createFile(
    filename,
    path.join(config.migrationsDir, folder || ''), // file dir
    utils.generateDbScript(config.dbInUse, templatePath) // data
  );

  if (type === 'trigger') {
    token.createToken(filename);
  }
  console.log('Migration script ' + filename + ' created!');
};
