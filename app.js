// Set your number here!
var phone_number = '(425) 409-6544';

/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
  io.set("log level", 0); 
});

// Routes

app.get('/', function(req,res){
  res.render('index',{title:'DisplayTexts',phone_number:phone_number});
});

app.post('/sms',function(req,res){
  console.log(req.body.Body);
  io.sockets.emit('sms', req.body);
  res.end();
});

app.post('/call',function(req,res){
  res.header("Content-Type", "text/xml");
  res.end('<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n<Say>Sorry but I don\'t accept phone calls, goodbye</Say>\n</Response>');
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
