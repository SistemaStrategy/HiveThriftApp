var bunyan = require('bunyan'),
	hiveClient = require('hive-thrift');
	app = require('./src/route.js');

var listeningPort = 8080;
var server;

/*Logger setup*/
var logger = bunyan.createLogger({
		name: 'HiveThriftApp',
		stream: process.stdout,
        level: "info"
});

/*Terminate the server properly*/
function endServer (session) {
	logger.info('Closing remaining connections ... ')
	server.close(function () {
		logger.info('Closed out remaining connections !')
		hiveClient.disconnect(session, function(error) {
			if(error) {
				logger.error('Hive disconnect error : ' + error);
				process.exit(1);
			} else {
				logger.info('Hive disconnect success');
				process.exit(0);
			}	
		});	
	});
}

hiveClient.connect(function (err, session) {
	if (err) {

		logger.error('Hive connection error : ' + err);
		process.exit(1);	

	} else {

		logger.info('Hive connection success');
		app.setupSession(hiveClient, session);

		server = app.listen(listeningPort, function (err) {
			if (err) {
				logger.error('HiveThriftApp error : ' + err );
				endServer(session);
			} else {
				logger.info('HiveThriftApp running on ' + require('os').hostname() + ':' + listeningPort);
	  			logger.info('pid is ' + process.pid);	
			}
		});

		process.on('SIGTERM', function() {endServer(session)});
		process.on('SIGINT', function() {endServer(session)});

	}
});