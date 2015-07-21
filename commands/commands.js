var Help    = require('./help.js');
var Attack  = require('./attack.js');
var Player  = require('./player.js');
var Outpost = require('./outpost.js');

var Commands = {
    Help   : new Help,
    Attack : new Attack,
    Outpost: new Outpost,
    Player : new Player,
};

module.exports = Commands;