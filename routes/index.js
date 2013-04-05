/**
Graveyard Social -- a social lobby for zombies
by Kang Peng (ktp242 on Github)

Version: 1.0
Start date: 20130404

working diary

*20130404
The very beginning. Build my own site "GSL."
This is for the routes. (routes/index.js)

 */


var moment = require("moment"); // date manipulation library
var astronautModel = require("../models/zombie.js"); //db model
var request = require('request'); //request JSON


exports.index = function(req, res){

  console.log("main page requested");
  res.render('index', { title: 'Graveyard Social' });

}
