/**
Graveyard Social -- a social lobby for zombies
by Kang Peng (ktp242 on Github)

Version: 1.0
Start date: 20130404

working diary

*20130404
The very beginning. Build my own site "GSL."

 */


// Module dependencies.
var express = require('express')
var http = require('http')
var path = require('path')
var mongoose = require('mongoose');


// the ExpressJS App
var app = express();


// configuration of port, templates (/views), static files (/public)
// and other expressjs settings for the web server.
app.configure(function(){
  
  // server port number
  app.set('port', process.env.PORT || 5000);
  
  //  templates directory to 'views'
  app.set('views', __dirname + '/views');

  // setup template engine - we're using Hogan-Express
  app.set('view engine', 'html');
  app.set('layout','layout');
  app.engine('html', require('hogan-express')); // https://github.com/vol4ok/hogan-express


  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

   // database
  app.db = mongoose.connect(process.env.MONGOLAB_URI);
  console.log("connected to database");

});

app.configure('development', function(){
  app.use(express.errorHandler());
});


// ROUTES
var routes = require('./routes/index.js');
app.get('/', routes.index);
app.post('/createDialogue',routes.createDialogue); //form POST submits here
app.get('/dialogue_log', routes.dialogue_log); // get remote data from DB
app.get('/data/zombie', routes.data_all); // get all data from DB as JSON
app.get('/data/zombie/:dialogue_id', routes.data_detail); // get detailed data from JSON


// create NodeJS HTTP server using 'app'
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});