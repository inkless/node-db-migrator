var path = require('path');

module.exports = {
  DB_SCRIPT_PLACEHOLDER: '/*DB_CONNECT_PLACEHOLDER*/',
  TRIGGER_FOLDER_NAME: 'trigger',
  TEMPLATES_PATH: path.join(__dirname, 'templates'),
  MIGRATE_TEMPLATE_PATH: path.join(__dirname, 'templates/migrate'),
  TRIGGER_TEMPLATE_PATH: path.join(__dirname, 'templates/trigger'),
  SQLITE_DB_NAME: 'db-migrator.sqlt',
  CHANGELOG_TABLE_NAME: 'migrations',
  TOKEN_TABLE_NAME: 'token'
};
