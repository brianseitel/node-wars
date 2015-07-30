var View = require('../view');
var Mapper = require('../mapper');

var Player = function() {};

Player.prototype.status = function(args, game) {
    var view = new View('./views/player.txt');
    var extras = { holdsRemaining: game.player.holdsRemaining() };
    return view.render({player: game.player, extras: extras});
};

Player.prototype.move = function(args, game) {
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
        var G      = Mapper.buildGraph(game.universe);
        var path   = Mapper.shortestPath(game.current_sector.id, action, G);
        message = "Shortest path is " + path.length + " hops: " + path.join(" -> ") + "\n";
    }

    return message;
};

Player.prototype.jump = function(args, game) {
    game.setState("JUMPING");
    var target = args[0];

    var G      = Mapper.buildGraph(game.universe);
    var path   = Mapper.shortestPath(game.current_sector.id, target, G);

    path.shift(); // first is always current sector, skip it.
    var finished = false;
    if (path.length > 1) {
        game.intervals["jump"] = setInterval(function() {
            if (!path.length) {
                clearTimeout(game.intervals["jump"]);
                game.setState("SPACE");
                console.log("You have arrived at your destination!");
                return game.getInput();
            }
            var next = path.shift();
            console.log(message = this.move([next], game));
            game.promptSpace();
        }.bind(this), 1000);
    };
};

module.exports = Player;