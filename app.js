var express = require('express');
var http = require('http');
var path = require('path');
var swig = require('swig');
var passport = require('passport');
var authorize = require('./source/utils/auth.js');
var config = require('./config');

// (!) auth init should be ALWAYS before app
authorize.init(passport);
var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.engine('html', swig.renderFile);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'html');
	app.use(express.cookieParser());
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.session({ secret: 'likeastore_marketing' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(authorize.localUserSession);
	app.use(app.router);
});

app.configure('development', function() {
	app.set('view cache', false);
	swig.setDefaults({ cache: false });
	app.use(express.logger('dev'));
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.errorHandler());
});

app.configure('staging', function () {
	app.set('view cache', false);
	swig.setDefaults({ cache: false });
	console.log(config.access.user + ' ' + config.access.password);
	app.use(express.basicAuth(config.access.user, config.access.password));
	app.use(express.logger('short'));
	app.use(express.compress());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.errorHandler());
});

app.configure('production', function() {
	app.use(express.logger('short'));
	app.use(express.compress());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.errorHandler());
});

app.configure('test', function() {
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.errorHandler());
});

require('./source/api.js')(app, passport);
require('./source/router.js')(app);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
