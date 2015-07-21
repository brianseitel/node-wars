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
    };

    this.move = function(args, game) {
        var message = "";
        action = parseInt(args[0], 10);
        if (action === game.current_sector.id) {
            message = "You are already there, dummy!\n";
        } else if (game.current_sector.hasNeighbor(action)) {
            message = "You warp to Sector " + action + " at light speed!\n";
            game.current_sector = game.universe.getSector(action);

            prompt = game.promptSpace();
            message = message + prompt.message;
        } else if (game.universe.hasSector(action)) {
            var mapper = new Mapper;
            var G      = mapper.buildGraph(game.universe);
            var path   = mapper.shortestPath(game.current_sector.id, action, G);
            message = "Shortest path is " + path.length + " hops: " + path.join(" -> ") + "\n";
        }

        return message;
    }
};

module.exports = Player;