var fs = require('fs');
var path = require('path');
var Promise = require('promise');
var getConfig = require('../config').getConfig;
var dbConnect = require('./db_connect');

exports.up = function(script) {
  migrate(script, 'up');
};

exports.down = function(script) {
  migrate(script, 'down');
};

function migrate(script, type) {
  var config = getConfig();
  var scriptWithPostfix = appendPostfix(script);
  var scriptsToRun;
  if (script) {
    if (checkScriptExist(scriptWithPostfix, config)) {
      scriptsToRun = [scriptWithPostfix];
    } else {
      console.error('No script found, please double check the script name.');
      process.exit(1);
    }
  } else {
    scriptsToRun = getAllScripts(config.migrationsDir, type);
  }

  scriptsToRun
    .reduce(function(cur, next) {
      return cur.then(function() {
        return runOneScript(next, type);
      });
    }, Promise.resolve())
    .then(function() {
      console.log('All migrations done.');
    });
}

function runOneScript(script, type) {
  var config = getConfig();
  var scriptPath = path.join(config.migrationsDir, script);
  var migrate = require(scriptPath);

  console.log('Running migration: ' + script + '...');
  // connect db
  migrate.connect(dbConnect);
  return new Promise(function(resolve, reject) {
    migrate[type](dbConnect.getAllConnections(), function() {
      // changelog
      // TODO
      console.log('Done...');
      dbConnect.endAll().then(resolve);

    });
  });
}

function getAllScripts(dir, type) {
  var files = fs.readdirSync(dir);
  return files.sort(function(a, b) {
    if (type === 'up') {
      return a.split('_')[0] > b.split('_')[0];
    } else {
      return a.split('_')[0] < b.split('_')[0];
    }
  });
}

function appendPostfix(name) {
  if (name.substr(-3, 3) !== '.js') {
    name += '.js';
  }
  return name;
}

function checkScriptExist(script, config) {
  try {
    fs.statSync(path.join(config.migrationsDir, script));
  } catch(e) {
    return false;
  }
  return true;
}
