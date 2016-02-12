var fs = require('fs');
var path = require('path');
var mkdirpSync = require('mkdirp').sync;
var moment = require('moment');

var DB_SCRIPT_PLACEHOLDER = require('../constant').DB_SCRIPT_PLACEHOLDER;

exports.checkExists = function(path) {
  try {
    fs.statSync(path);
  } catch(e) {
    return false;
  }
  return true;
};

exports.createFile = function(name, dir, data) {
  var writeDest = path.join(dir, name);
  mkdirpSync(dir);
  fs.writeFileSync(writeDest, data);
};

exports.generateDbScript = function(dbNames, templatePath) {
  var scriptTemplate = fs.readFileSync(templatePath).toString();
  var newScriptSnippets = dbNames.map(function(dbName) {
    return '  dbConnect.connect("' + dbName + '");';
  }).join('\n');
  return scriptTemplate.replace(DB_SCRIPT_PLACEHOLDER, newScriptSnippets);
};

exports.generateFilename = function(name, postfix) {
  postfix = postfix || '.js';
  return moment().format('YYYYMMDDHHmmss') + '_' +name + postfix;
};
