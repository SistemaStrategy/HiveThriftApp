
var express = require('express');
var mustacheExpress = require('mustache-express');
var bodyParser = require('body-parser');
var app = express();
var hiveSession, hiveClient;

/*Define view template and public directory for the app*/
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/html');
app.use(express.static( __dirname + '/public'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

/*Setup session for hive access, must be done by the app*/
app.setupSession = function (client, session) {
	hiveSession = session;
	hiveClient = client
}

function handleHiveError (title, err, response) {
	response.render('error', {
		head: {title: title},
		error: {title: 'Hive error', message: err }
	});
}

function handleAppliError (title, message, response) {
	 response.render('error', {
		head: {title: 'HiveThriftApp - Error'},
		error: {title: title, message: message }
	});
}

app.get('/schemas', function(request, response) {

	hiveClient.getSchemasNames(hiveSession, function (err, resSchema) {
			if(err) {
				handleHiveError('Erreur getSchemasNames', err, response);
			} else {
				response.render('index', {
					head: {title: 'HiveThriftApp'},
					page: {title: 'Schema list', data: JSON.stringify(resSchema)}
				});
			}
	});

}).get('/columns/:schema/:table', function(request, response) {

	var schema = request.params.schema;
	var table = request.params.table;

	hiveClient.getColumns(hiveSession, schema, table, function (err, resColumns) {
		if(err) {
			handleHiveError('Erreur getColumns', err, response);
		} else {
			response.render('table', {
				head: {title: 'HiveThriftApp - Table'},
				page: {title: schema + '.' + table + ' columns ', data: JSON.stringify(resColumns)}
			});
		}
	});

}).get('/select_all/:schema/:table', function(request, response) {

	var schema = request.params.schema;
	var table = request.params.table;

	var selectStatement = 'select * from ' + schema + '.' + table;
	hiveClient.executeSelect(hiveSession, selectStatement, function (err, resData) {
		if(err) {
			handleHiveError('Erreur executeSelect', err, response);
		} else {
			response.render('table', {
				head: {title: 'HiveThriftApp - Data'},
				page: {title: schema + '.' + table + ' data ', data: JSON.stringify(resData)}
			});
		}
	});

}).get('/select', function(request, response) {

	response.render('query', {
		head: {title: 'HiveThriftApp - Query'},
		page: {title: 'Query hive database', data: 'Nothing to display ... '}
	});

}).post('/select', function(request, response) {

	hiveClient.executeSelect(hiveSession, request.body.statement , function (err, resQuery) {
		if(err) {
			handleHiveError('Erreur executeSelect', err, response);
		} else {
			response.render('table', {
				head: {title: 'HiveThriftApp - Query'},
				page: {title: 'Query hive database', data: JSON.stringify(resQuery)}
			});
		}
	});

}).use(function(request, response, next){

	handleAppliError('Page not found', 'The page you are looking for is not existing ... ', response);

});

module.exports = app;