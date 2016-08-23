var express = require('express');
var router = express.Router();
var csvjson = require('csvjson');
var fs = require('fs');
var path = require('path');
var util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/genjson', function(req, res, next) {
  console.log('about to convert to json');
  
  var data = fs.readFileSync('telemetry_sample.csv', {encoding: 'utf8'});
  var convertOptions = { delimeter : ',' };
  
  var jsonobj = csvjson.toObject(data, convertOptions);
    
  console.log('returng json response');
  res.send(jsonobj);
  
});

router.post('/genjsonfile', function(req, res, next) {
  console.log('about to convert to json file');
  
  var data = fs.readFileSync('telemetry_sample.csv', {encoding: 'utf8'});
  var convertOptions = { delimeter : ',' };
  
  var jsonobj = csvjson.toObject(data, convertOptions);
  fs.writeFile("telemetry_out.json", util.inspect(jsonobj), function(err) {
    if(err)
      return console.log(err);
  });
  
  console.log('wrote to json file');
  res.status(204).end();
  
});


module.exports = router;
