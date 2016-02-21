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
### Create a migration script
node-db-migrator
