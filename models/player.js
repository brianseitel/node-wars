var Player = function() {
    this.name    = null;
    this.level   = 1
    this.credits = 0;
    this.cargo   = { ore: 0, fuel: 0, weapons: 0 };
};

module.exports = Player;