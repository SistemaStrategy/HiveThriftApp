# HiveThriftApp
HiveThriftApp is a node application querying hive database using hive-thrift node module. It's a web application and a REST API which can be used by other systems to query hive.

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
### Web application
You can access the web application by using a browser and type in the following URL's 
* localhost:8080/schemas : List hive schemas
* localhost:8080/columns/**schemaName**/**tableName** : List all columns for **schemaName**.**tableName**
* localhost:8080/select : Perform a select query, specified by the user

### REST API
The application is also provinding a REST API and the resources are the following
* GET localhost:8080/rest/schemas : return a list of schemas
* GET localhost:8080/rest/columns/**schemaName**/**tableName** : return all columns for **schemaName**.**tableName**
* POST localhost:8080/rest/select [args : {statement}] : Perform a select query, specified by the *statement* parameter

To test the REST API you can use curl for GET and POST request, example for POST request :  
```
curl -H "Content-Type: application/json" -X POST -d '{"statement":"select * from test.emp"}' http://localhost:8080/rest/select
```