var config = require('../config')

var Trader = function() {
    this.name    = null;
    this.sector  = 1;
    this.level   = 1;
    this.credits = 0;
    this.ship    = null;
    this.holds   = 100;
    this.cargo   = { 
        fuel      : 0,
        organics  : 0,
        equipment : 0
    };

};

Trader.prototype.holdsRemaining = function() {
    return (this.holds - this.cargo.fuel - this.cargo.organics - this.cargo.equipment).toString();
};

Trader.prototype.init = function() {
    this.level = Math.floor(Math.random() * 10) + 1;
    this.sector = 1;
    this.credits = Math.floor(Math.random() * 1000 * this.level);
    this.ship    = "Imperial Starship";
    this.holds   = 100;
    this.cargo = {
        fuel: Math.floor(Math.random() * 100),
        organics: Math.floor(Math.random() * 50),
        equipment: Math.floor(Math.random() * 25)
    };

    return this;
};

Trader.prototype.update = function(game) {
    var universe = game.universe;
    var emitter  = game.emitter;

    if (!universe) { throw game.universe; }
    this.move(universe, emitter);
};

Trader.prototype.move = function(universe, emitter) {
    var chance = Math.floor(Math.random() * 100);
    if (chance < config.TRADER_MOVE_CHANCE) {
        var sector    = universe.getSector(this.sector);
        var neighbors = shuffle(sector.neighbors.slice(0));

        var next    = neighbors[0];
        var old     = parseInt(this.sector, 10);
        this.sector = next;

        emitter.emit('trader.move', this, old);
    }
};

function shuffle(o) {
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

module.exports = Trader;