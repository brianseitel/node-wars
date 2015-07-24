var View = require('../view.js');
var Mapper = require('../mapper.js');
var Player = function() {
    
    this.status = function(args, game) {
        var view = new View('./views/player.txt');
        var extras = { holdsRemaining: game.player.holdsRemaining() };
        return view.render({player: game.player, extras: extras});
    };

    this.move = function(args, game) {
        var message = "";
        action = parseInt(args[0], 10);
        if (action === game.current_sector.id) {
            message = "You are already there, dummy!\n";
        } else if (game.current_sector.hasNeighbor(action)) {
            message = "You warp to Sector " + action + " at light speed!\n";
            game.current_sector = game.universe.getSector(action);
            game.player.sector = game.current_sector.id;
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