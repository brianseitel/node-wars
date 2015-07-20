var Player = function() {
    
    this.status = function(args, game) {
        var p = game.player;

        console.log(p);
        var text  = "";
            text += "\n " + p.name
            text += "\n " + Array(p.name.length + 1).join("-");
            text += "\n Level:   " + p.level;
            text += "\n Credits: " + p.credits;
            text += "\n Cargo:   ";
            text += "\n \t Ore:     " + p.cargo.ore;
            text += "\n \t Fuel:    " + p.cargo.fuel;
            text += "\n \t Weapons: " + p.cargo.weapons;
            text += "\n";

        console.log(text);
    }
};

module.exports = Player;