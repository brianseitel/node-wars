var Help    = require('./help');
var Attack  = require('./attack');
var Player  = require('./player');
var Outpost = require('./outpost');

var Commands = {
    Help       : new Help,
    Attack     : new Attack,
    Outpost    : new Outpost,
    Player     : new Player,
    OutpostBuy : new Outpost,
    OutpostSell: new Outpost,
    Jump       : new Player,
};

module.exports = Commands;