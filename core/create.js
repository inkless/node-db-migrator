var fs = require('fs');
var path = require('path');
var mkdirpSync = require('mkdirp').sync;

var getConfig = require('../config').getConfig;
var utils = require('../libs/utils');

module.exports = function(migrationName, templatePath, folder) {
  var config = getConfig();
  var filename = utils.generateFilename(migrationName);
  utils.createFile(
    filename,
    path.join(config.migrationsDir, folder || ''), // file dir
    utils.generateDbScript(config.dbInUse, templatePath) // data
  );
  console.log('Migration script ' + filename + ' created!');
};
