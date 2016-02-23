var fs = require('fs');
var path = require('path');
var mkdirpSync = require('mkdirp').sync;
var _ = require('lodash');

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
  return getCurrentTimeString() + '_' +name + postfix;
};

function getCurrentTimeString() {
  var d = new Date();
  return [
    d.getFullYear(),
    _.padStart(d.getMonth() + 1, 2, '0'),
    _.padStart(d.getDate(), 2, '0'),
    _.padStart(d.getHours(), 2, '0'),
    _.padStart(d.getMinutes(), 2, '0'),
    _.padStart(d.getSeconds(), 2, '0')
  ].join('');
}
