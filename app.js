/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var invite = require('./source/utils/invite');
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./source/router.js')(app);
require('./source/api.js')(app);

invite.ensureInvites(function (err) {
  if (err) {
    return console.log(err);
  }

  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
});

