/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var db = require('./db-config.js');
var mongoose = require('mongoose');

var forecastController = require('./controllers/forecastController');
var ForecastModel = require('./models/forecastModel');

var app = express();

db.connect();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/* move to dev eventually */
app.get('/all', forecastController.findAll);
app.get('/', forecastController.find);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
