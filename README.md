# node db migrator
Node.js Database Migration

## Why another db migrator
- Migration between multiple database

Support migration from one mysql database to another mysql database, or even to a mongo database

- Script based migration

Support javascript migration script besides SQL migration script. Provide extreme flexibility to data migration.

- Daemon to handle delta data
Support spin up a daemon to handle delta data. Allows data migration for some specific situation and parameters.

## Installation
Install globally:
```
npm install -g node-db-migration
```
Install locally
```
npm install node-db-migration
```
Executable location:
`node_modules/node-db-migration/bin/node-db-migrator`

## Usage
### Configuration
Before start the migration, create a `database.json` file.

Example:
```json
{
  "defaultDb": "mysql",

  "mysql": {
    "driver": "mysql",
    "user": "root",
    "password": "yourpassword",
		"database": "node_db_migration",
    "host": "localhost",
    "multipleStatements": true
  },

  "mongo": {
    "driver": "mongodb",
    "database": "node_db_migration",
    "host": "localhost"
  }

}
```

### Create a migration script
```
node-db-migrator create "your file name"
```
A new migration script will be created in your migration folder. By default the folder is `your_workspace/migrations`.
Add code to the scripts to create a new migration.

### Run migrations
#### Run all migrations
```
node-db-migrator up
```
Only migrations that all not run yet will be run. If there're multiple migrations to be run, they will be run sequentially according to their creation time.

#### Run specific migration
```
node-db-migrator up migration_file_name
```

### Revert migrations
#### Revert all migrations
```
node-db-migrator down
```
All migrations that are run already will be reverted.

#### Revert specific migration
```
node-db-migrator down migration_file_name
```

### Create a triggering script
```
node-db-migrator trigger "your trigger script name"
```
Create a triggering script to handle delta data.

Notice: a token will be shown in the terminal, you can use it to refer to this triggering script.

#### What is triggering script?
Triggering script is used to simplify the double write. Sometimes it's very hard to implement a double write in your code, then you can think about using a triggering script.

When writing data, you called the API of triggering script and passed the parameters needed. The triggering script will do everything else.

For example: You are modifying changing column `info` to `new_info` in `Customer` table.  In your code you can do:
```
// pseudo code
triggerMigration(
  token /*your migration token*/,
  {customerId: customer_id} /*params*/
);
```
Then in node db migrator's daemon, it will catch this request and do the migration.

A common triggering migration script will look like this:
```javascript
exports.trigger = function(db, params, callback) {
  var customerId = params.customer_id;
  db.mysql.query(
    'some sql where customer_id = ?',
    [customerId],
    callback
  );
};
```

### Spin up daemon
```
node-db-migrator daemon
```
Spin up a daemon to listen to request to triggering migrations. By default it will spin up an http server (port: 8899) and a kafka consumer (topic: kafka\_node\_db\_migration).

#### Other operations about daemon
```
# list all daemon
node-db-migrator daemon list
# stop specific daemon
node-db-migrator daemon stop [daemon_id]
# stop all daemon
node-db-migrator daemon stopall
```

### Options
There're several options when using the node db migrator
##### -v, --version
 Print version info.

##### -m, --migrations-dir
The directory containing your migration files. *[default: "workspace/migrations"]*

##### -d, --migrations-database
Set the path of the migration table, which stores the migration history. *[default: "workspace/db"]*

##### -c, --db-config
Location of the database.json file. *[default: "workspace/database.json"]*

##### -u, --db-in-use
Database might in use (mysql,mongo). *[default: "mysql"]*

##### -p, --port
Port number when running daemon. *[default: "8899"]*

##### --sql-file
Automatically create two sql files for up and down statements in /sqls and generate the javascript code that loads them. *[default: false | To be implemented]*

##### --dry-run
Prints the SQL but doesn't run it. *[default: false | To be implemented]*
