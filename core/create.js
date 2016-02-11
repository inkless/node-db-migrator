var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var moment = require('moment');

var getConfig = require('../config').getConfig;
var DB_SCRIPT_PLACEHOLDER = '/*DB_CONNECT_PLACEHOLDER*/';
var TEMPLATES_PATH = path.join(__dirname, '../templates');
var MIGRATE_TEMPLATE_PATH = path.join(TEMPLATES_PATH, 'migrate');

module.exports = function(migrationName) {
  var config = getConfig();
  createFile(generateFilename(migrationName), config.migrationsDir, generateScript(config.dbInUse));
};

function createFile(name, dir, script) {
  var writeDest = path.join(dir, name);
  mkdirp(dir, function() {
    fs.writeFileSync(writeDest, script);
    console.log('Migration script ' + name + ' created!');
  });
}

function generateFilename(name) {
  return moment().format('YYYYMMDDHHmmssSSS') + '_' +name + '.js';
}

function generateScript(dbNames) {
  var scriptTemplate = fs.readFileSync(MIGRATE_TEMPLATE_PATH).toString();
  var newScriptSnippets = dbNames.map(function(dbName) {
    return '  dbConnect.connect("' + dbName + '");';
  }).join('\n')
  return scriptTemplate.replace(DB_SCRIPT_PLACEHOLDER, newScriptSnippets);
}
