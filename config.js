var minimist = require('minimist');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var checkExists = require('./libs/utils').checkExists;
var CONSTANT = require('./constant');

var cwd = process.cwd();
var argv = minimist(process.argv.slice(2));

var config = {
  migrationsDir: CONSTANT.DEFAULT_MIGRATIONS_DIR,
  migrationsDatabase: CONSTANT.DEFAULT_MIGRATIONS_DATABASE,
  dbConfig: CONSTANT.DEFAULT_DB_CONFIG,
  port: CONSTANT.DEFAULT_PORT
};

configure(retrieveConfig(argv));

function configure(newConfig) {
  _.extend(config, newConfig);
  if (!checkExists(config.dbConfig)) {
    // if checking version or help
    if (argv.version || argv.help) {
      config.dbInUse = 'TBD';
      return;
    }
    console.error('Cannot access to the database config!\nPlease verify your --db-config...');
    process.exit(1);
  }

  config.databases = require(config.dbConfig);
  if (!config.dbInUse) {
    if (config.databases.defaultDb) {
      config.dbInUse = [config.databases.defaultDb];
    } else {
      config.dbInUse = _.keys(config.databases);
    }
  }
};

function retrieveConfig(argv) {
  argv = retrieveShortArg(argv);
  var config = {};
  ['migrations-dir', 'migrations-database', 'db-config'].forEach(function(conf) {
    if (!argv[conf]) {
      return;
    }

    config[_.camelCase(conf)] =
      path.isAbsolute(argv[conf]) ?
        argv[conf] :
        path.join(cwd, argv[conf]);
  });

  if (argv['db-in-use']) {
    config.dbInUse = argv['db-in-use'].split(',');
  }

  if (argv.port) {
    config.port = parseInt(argv.port);
  }

  argv.command = argv._[0];
  argv.param = _.snakeCase(argv._[1]);

  config.argv = argv;
  return config;
}

function retrieveShortArg(argv) {
  var shortMap = {
    'migrations-dir': 'm',
    'migrations-database': 'd',
    'db-config': 'c',
    'db-in-use': 'u',
    'port': 'p',
    'help': 'h',
    'version': 'v'
  };

  for (var cmd in shortMap) {
    if (!argv[cmd]) {
      argv[cmd] = argv[shortMap[cmd]];
    }
  }
  return argv;
}

module.exports = config;
