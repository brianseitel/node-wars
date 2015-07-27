var Player = function() {
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

Player.prototype.holdsRemaining = function() {
    return (this.holds - this.cargo.fuel - this.cargo.organics - this.cargo.equipment).toString();
};

Player.prototype.broadcast = function(message, game) {
    if (game.inSpace()) {
        console.log(message);
    }
};

module.exports = Player;