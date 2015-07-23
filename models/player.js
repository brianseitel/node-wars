var Player = function() {
    this.name    = null;
    this.level   = 1
    this.credits = 0;
    this.ship    = null;
    this.cargo   = {
        max       : 100, 
        fuel      : 0,
        organics  : 0,
        equipments: 0
    };

};

module.exports = Player;