var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var routes = require('./routes/index');
var r_controls = require('./routes/controls');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'thing.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
  console.log(__dirname + '\\views\\index.html');
  res.sendFile(__dirname + '\\views\\index.html');
  
});


app.use('/actuators', r_controls);

server.listen(4200);


//app.use('/', routes);
/*app.use('/genjson', routes);
app.use('/genjsonfile', routes);
app.use('/users', users);*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler 
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.message);
    /*
    res.render('error', {
      message: err.message,
      error: err
    });*/
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err.message);
  /*
  res.render('error', {
    message: err.message,
    error: {}
  });*/
});

function getNewFileData(socket) {
  //Format of each input file should be <sensor_name>.txt
  var sensorFiles = ["laser.txt"];
  
  for(s in sensorFiles)
  { 
    var f = sensorFiles[s];
    fs.readFile(f, "utf-8", (err,data) => {
      if(err) throw err;
      var sensorType = f.split(".")[0];
      
      socket.emit("sensor_clear", sensorType);

      var lines = data.toString().split("\n");

      for(i in lines) {
        socket.emit("sensor_update", { "type" : sensorType, "data" : lines[i] } );
      }
      console.log("sent " + sensorType + " data from telem.txt");
    }); 
  }
}

io.on('connection', function(socket) {
  console.log("connection occurred");
  socket.emit('news', {data : 'this is the from server'});
  socket.on('join', function (data) {
      console.log(data);
    
      //var fd = fs.openSync("telem.txt", 'r');
    
      //getNewFileData(socket);
      setInterval(function () { getNewFileData(socket); }, 5000);    
    
  });
  
  
});


module.exports = app;
