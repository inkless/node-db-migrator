var fs = require('fs');
var path = require('path');
var mkdirpSync = require('mkdirp').sync;

var config = require('../config');
var utils = require('../libs/utils');
var token = require('../libs/token');
var changelog = require('../libs/changelog');
var TRIGGER_FOLDER_NAME = require('../constant').TRIGGER_FOLDER_NAME;

module.exports = function(migrationName, templatePath, type) {
  if (!migrationName) {
    console.error('Please specify migration name.');
    process.exit(1);
  }
  var filename = utils.generateFilename(migrationName);
  var isTrigger = type === 'trigger';
  if (isTrigger) {
    token.init(function() {
      create(filename, templatePath, true);
    });
  } else {
    create(filename, templatePath);
  }
};

function create(filename, templatePath, isTrigger) {
  var dir = isTrigger ?
    path.join(config.migrationsDir, TRIGGER_FOLDER_NAME) :
    config.migrationsDir;

  utils.createFile(
    filename, dir,
    utils.generateDbScript(config.dbInUse, templatePath) // data
  );

  if (isTrigger) {
    token.createToken(filename);
  }
  console.log('Migration script ' + filename + ' created!');
}
