var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Promise = require('promise');
var getConfig = require('../config').getConfig;
var dbConnect = require('../libs/db_connect');
var checkExists = require('../libs/utils').checkExists;
var changelog = require('../libs/changelog');

exports.up = function(script) {
  migrate(script, 'up');
};

exports.down = function(script) {
  migrate(script, 'down');
};

exports.trigger = function(script, params) {
  migrate(script, 'trigger', params);
};

function migrate(script, type, params) {
  var config = getConfig();
  var scriptWithPostfix = appendPostfix(script);
  var isTriggerMigration = type === 'trigger';
  var dir = isTriggerMigration ? path.join(config.migrationsDir, 'trigger') : config.migrationsDir;
  var scriptsToRun;
  if (script || type === 'trigger') {
    if (checkExists(path.join(dir, scriptWithPostfix))) {
      scriptsToRun = [scriptWithPostfix];
    } else {
      console.error('No script found, please double check the script name.');
      process.exit(1);
    }
  } else {
    scriptsToRun = getAllScripts(dir, type);
  }

  if (!scriptsToRun.length) {
    console.log('No migrations needed.');
    return;
  }

  scriptsToRun
    .reduce(function(cur, next) {
      return cur.then(function() {
        return runOneScript(next, dir, type, params);
      });
    }, Promise.resolve())
    .then(function() {
      if (!isTriggerMigration) {
        changelog.close();
      }
      console.log('All migrations done.');
    });
}

function runOneScript(script, dir, type, params) {
  var config = getConfig();
  var scriptPath = path.join(dir, script);
  var migrate = require(scriptPath);

  console.log('Running migration: ' + script + '...');
  // connect db
  migrate.connect(dbConnect);
  return new Promise(function(resolve, reject) {
    var args = [dbConnect.getAllConnections()];
    if (type === 'trigger') {
      args.push(params);
    }
    args.push(function() {
      recordChange(script, type, dir);
      dbConnect.endAll().then(resolve);
    });
    migrate[type].apply(undefined, args);
  });
}

function recordChange(script, type, migrationsDir) {
  var name = _.trimEnd(script, '.js');
  switch(type) {
    case 'up':
      changelog.addLog(name, migrationsDir);
      break;
    case 'down':
      changelog.removeLog(name, migrationsDir);
      break;
  }
}

function getAllScripts(dir, type) {
  var files = fs.readdirSync(dir).filter(function(name) {
    return name.substr(-3, 3) === '.js';
  });
  var allLogs = changelog.getAllLogsFromCache().map(function(log) {
    return log.name;
  });

  if (type === 'up') {
    return files.sort(function(a, b) {
      return a.split('_')[0] > b.split('_')[0];
    }).filter(function(file) {
      return !~allLogs.indexOf(_.trimEnd(file, '.js'));
    });
  } else {
    return allLogs.filter(function(logName) {
      return ~files.indexOf(logName + '.js');
    }).sort(function(a, b) {
      return a.split('_')[0] < b.split('_')[0];
    });
  }
}

function appendPostfix(name) {
  if (name.substr(-3, 3) !== '.js') {
    name += '.js';
  }
  return name;
}
