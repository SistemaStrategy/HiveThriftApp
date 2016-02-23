# HiveThriftApp
HiveThriftApp is a node application querying hive database using hive-thrift node module.

##Prerequisite
* NodeJS >= 4.3.0
* npm 
* git (installation from sources)

## Install 
###Install from sources
To install HiveThriftApp you need to checkout the sources: `git clone git://github.com/SistemaStrategy/HiveThriftApp.git`

## Getting Started
### From sources
* Update the config.json file with your settings
* Execute the following commands:
```
npm install 
node app.js | ./node_modules/bunyan/bin/bunyan
```
If you're using a Vagrant box, use the --no-bin-links argument
```
npm install --no-bin-links
```
Bunyan is a simple and fast JSON logging library for node.js service. A bunyan CLI tool is provided (**./node_modules/bunyan/bin/bunyan**) for pretty-printing bunyan logs and for filtering.
To learn more about Bunyan click [here](https://github.com/trentm/node-bunyan).

## Hive configuration
The Hive configuration is stored in a config.json file present in the root directory of the project. The host must be pointing to the **HiveServer2** instance.

## Usage
* /schemas : List hive schemas
* /columns/**schemaName**/**tableName** : List all columns for **schemaName**.**tableName**
* /select_all/**schemaName**/**tableName** : Perform a select * query on **schemaName**.**tableName**
* /query : Perform a select query, specified by the user
