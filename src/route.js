
var express = require('express');
var mustacheExpress = require('mustache-express');
var bodyParser = require('body-parser');
var app = express();
var hiveSession, hiveClient;

/*Define view template and public directory for the app*/
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/../views');
app.use(express.static( __dirname + '/../public'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

/*Setup session for hive access, must be done by the app*/
app.setupSession = function (client, session) {
	hiveSession = session;
	hiveClient = client
}

function renderError(isRest, error, response){
	if(isRest) {
		response.writeHead(400, {'Content-Type': 'application/json'});
		response.end(JSON.stringify(err));
	} else {
		response.render('error', {
			head: {title: 'HiveThriftApp - Error'},
			error: {title: 'HiveThriftApp - Error', message: err }
		});
	}
}

function renderRestResponse(code, data, response) {
	response.writeHead(code, {'Content-Type': 'application/json'});
	response.end(JSON.stringify(data));
}

/*Define REST API routes*/
app.get('/:rest?/schemas', function(request, response) {

	/*Define the render method : rest or web page*/
	var rest = (request.params.rest == 'rest' ? true : false);

	/*Get hive schemas*/
	hiveClient.getSchemasNames(hiveSession, function (err, resSchema) {

		if(err) {
			renderError(rest,err,response);
		} else {
			if(rest) {
				renderRestResponse(200,resSchema,response);
			} else {
				response.render('index', {
					head: {title: 'HiveThriftApp'},
					page: {title: 'Schema list', data: JSON.stringify(resSchema)}
				});
			}
		}
	});
}).get('/rest?/columns/:schema/:table', function(request, response) {

	/*Define the render method : rest or web page*/
	var rest = (request.params.rest == 'rest' ? true : false);

	var schema = request.params.schema;
	var table = request.params.table;

	/*Get table columns*/
	hiveClient.getColumns(hiveSession, schema, table, function (err, resColumns) {
		if(err) {
			renderError(rest,err,response);
		} else {
			if(rest) {
				renderRestResponse(200,resColumns,response);
			} else {
				response.render('table', {
					head: {title: 'HiveThriftApp - Table'},
					page: {title: schema + '.' + table + ' columns ', data: JSON.stringify(resColumns)}
				});
			}
		}
	});
}).get('/select', function(request, response) {

	response.render('query', {
		head: {title: 'HiveThriftApp - Query'},
		page: {title: 'Query hive database', data: 'Nothing to display ... '}
	});

}).post('/:rest?/select', function(request, response) {

	/*Define the render method : rest or web page*/
	var rest = (request.params.rest == 'rest' ? true : false);

	/*Check that statement exists*/
	if(request.body.statement) {
		hiveClient.executeSelect(hiveSession, request.body.statement , function (err, resQuery) {
			if(err) {
				renderError(rest,err,response);
			} else {
				if(rest){
					renderRestResponse(200,resQuery,response);
				} else {
					response.render('table', {
						head: {title: 'HiveThriftApp - Query'},
						page: {title: 'Query hive database', data: JSON.stringify(resQuery)}
					});
				}
			}
		});	
	} else {
		renderError(rest,'{"message":"Missing \"statement\" POST argument"}',response);
	}
}).use(function(request, response, next){

	response.render('error', {
			head: {title: 'HiveThriftApp - Error'},
			error: {title: 'HiveThriftApp - Page not found', message: 'The page you are looking for is not existing ... ' }
	});

});

module.exports = app;