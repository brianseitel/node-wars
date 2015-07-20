var Help = require('./help.js');
var Attack = require('./attack.js');
var Player = require('./player.js');

var Commands = {
    Help  : new Help,
    Attack: new Attack,
    Player: new Player,
};

module.exports = Commands;