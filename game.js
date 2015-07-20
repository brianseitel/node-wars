var Universe = require('./universe.js');
var Helper   = require('./helpers.js');
var Mapper   = require('./mapper.js');
var Commands = require('./commands.js');
var Shop     = require('./shop.js');
var fs       = require('fs');

var helpers = new Helper;
var prompt  = require('prompt');
var Game = function() {
    this.universe       = new Universe;
    this.current_sector = null;
    this.commands       = new Commands;

    this.start = function(universe) {
        this.universe      = helpers.load(this.universe);
        this.current_sector = this.universe.getSector(1);

        this.loadCommands();
        this.getInput();
    },

    this.loadCommands = function() {
        var commands = JSON.parse(fs.readFileSync('data/commands.json', 'utf8'));

        for (i in commands) {
            this.commands.register(commands[i].name, commands[i].method);
        }
    },

    this.getInput = function() {
        var game = this;
        prompt.start();
        game.current_sector.neighbors.sort();

        prompt.message = "You are in " + game.current_sector.name + ".\n";
        for (s in game.universe.shops) {
            if (game.universe.shops[s].sector == game.current_sector.id) {
                prompt.message += "Joe's Crab Shack: " + game.universe.shops[s].inventory() + "\n";
            }
        }
        prompt.message += "Neighbors: [" + game.current_sector.neighbors.join(", ") + "]";
        prompt.get(['input'], function(err, result) {
            if (err) { return helpers.onErr(err); }

            if (result.input == 'done') {
                console.log("Bye!");
                return 1;
            }

            if (parseInt(result.input)) {
                var input = parseInt(result.input);

                if (input === game.current_sector.id) {
                    console.log("You are already there, dummy!");
                } else if (game.current_sector.hasNeighbor(input)) {
                    console.log("You warp to Sector " + input + " at light speed!");
                    game.current_sector = game.universe.getSector(input);
                } else if (game.universe.hasSector(input)) {
                    var mapper = new Mapper;
                    var G      = mapper.buildGraph(game.universe);
                    var path   = mapper.shortestPath(game.current_sector.id, input, G);
                    console.log("Shortest path is " + path.length + " hops: " + path.join(" -> "));
                } else {
                    console.log("You can't get there from here!");
                }

            } else {
                console.log("Invalid input. Try again.");
            }

            game.getInput();
        });
    };
};

module.exports = Game;