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

    this.holdsRemaining = function() {
        return (this.holds - this.cargo.fuel - this.cargo.organics - this.cargo.equipment).toString();
    }

    this.init = function() {
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
};

module.exports = Trader;