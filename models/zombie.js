/**
Graveyard Social -- a social lobby for zombies
by Kang Peng (ktp242 on Github)

Version: 1.0
Start date: 20130404

working diary

*20130404
The very beginning. Build my own site "GSL."
This is for the DB Schema. (models/zombie.js)

 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// export 'Zombie' model
module.exports = mongoose.model('Zombie',ZombieSchema);