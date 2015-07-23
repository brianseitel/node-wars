var Player = function() {
    this.name    = null;
    this.level   = 1
    this.credits = 0;
    this.ship    = null;
    this.holds   = 100;
    this.cargo   = { 
        fuel      : 0,
        organics  : 0,
        equipment : 0
    };

    this.holdsRemaining = function() {
        return (this.holds - this.cargo.fuel - this.cargo.organics - this.cargo.equipment).toString();
    }

};

module.exports = Player;