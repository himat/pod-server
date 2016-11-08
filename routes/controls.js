var express = require('express');
var router = express.Router();
var csvjson = require('csvjson');
var fs = require('fs');
var path = require('path');
var util = require('util');

/* GET home page. */
router.post('/', function(req, res, next) {
  console.log("POSTED TO / IN CONTROLS.JS");
});

router.post('/retract/', function(req, res, next) {
  console.log("POSTED TO /retract IN CONTROLS.JS");
  fs.writeFile("actuators.txt", req.body.type + " retract", function(err) {
    if(err)
      return console.log("Wrote to actuators files error: " + err);
  });
  
  res.status(204).end();
});

router.post('/extend', function(req, res, next) {
  console.log("POSTED TO /extend IN CONTROLS.JS");
  fs.writeFile("actuators.txt", req.body.type + " extend", function(err) {
    if(err)
      return console.log("Wrote to actuators files error: " + err);
  });
  
  res.status(204).end();
});

router.post('/actuators/retract', function(req, res, next) {
  console.log('POSTED TO /ACTUATORS/RETRACT IN CONTROL.JS');
  
  
  /*fs.writeFile("telemetry_out.json", data, function(err) {
    if(err)
      return console.log(err);
  });
  
  console.log('wrote to json file');*/
  res.status(204).end();
  
});
  
  
module.exports = router;