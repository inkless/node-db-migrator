var path = require('path');
var cwd = process.cwd();

module.exports = {
  DB_SCRIPT_PLACEHOLDER: '/*DB_CONNECT_PLACEHOLDER*/',
  TRIGGER_FOLDER_NAME: 'trigger',
  MIGRATE_TYPE: {
    UP: 'up',
    DOWN: 'down',
    TRIGGER: 'trigger'
  },
  TEMPLATES_PATH: path.join(__dirname, 'templates'),
  MIGRATE_TEMPLATE_PATH: path.join(__dirname, 'templates/migrate'),
  TRIGGER_TEMPLATE_PATH: path.join(__dirname, 'templates/trigger'),
  SQLITE_DB_NAME: 'db-migrator.sqlt',
  CHANGELOG_TABLE_NAME: 'migrations',
  TOKEN_TABLE_NAME: 'token',
  KAFKA_TOPIC: 'kafka_node_db_migration',
  KAFKA_CONNECTION_STRING: 'localhost:2181/',
  KAFKA_CLIENT_ID: 'db-migrator-kafka-client',
  DEFAULT_MIGRATIONS_DIR: path.join(cwd, 'migrations'),
  DEFAULT_MIGRATIONS_DATABASE: path.join(cwd, 'db'),
  DEFAULT_DB_CONFIG: path.join(cwd, 'database.json'),
  DEFAULT_PORT: 8899
};
