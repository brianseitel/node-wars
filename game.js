var Universe = require('./universe.js');
var Helper   = require('./helpers.js');
var Mapper   = require('./mapper.js');
var Commands = require('./commands/commands.js');
var Shop     = require('./shop.js');
var fs       = require('fs');

var helpers = new Helper;
var prompt  = require('prompt');
var Game = function() {
    this.universe       = new Universe;
    this.player         = null;
    this.current_sector = null;

    this.start = function(universe, player) {
        this.universe       = helpers.load(this.universe);
        this.player         = helpers.loadPlayer();
        this.current_sector = this.universe.getSector(1);

        this.getInput();
    },

    this.getInput = function() {
        prompt.start();
        this.current_sector.neighbors.sort();

        prompt.message = "You are in " + this.current_sector.name + ".\n";
        for (s in this.universe.shops) {
            if (this.universe.shops[s].sector == this.current_sector.id) {
                prompt.message += "Joe's Crab Shack: " + this.universe.shops[s].inventory() + "\n";
            }
        }
        prompt.message += "Neighbors: [" + this.current_sector.neighbors.join(", ") + "]";
        prompt.get(['input'], this.processInput.bind(this));
    };

    this.processInput = function(err, result) {
        if (err) { return helpers.onErr(err); }

        if (result.input == 'done') {
            console.log("Bye!");
            return 1;
        }

        var args = result.input.split(' ');
        var action = args.shift().toLowerCase();
        if (this.commandList[action]) {
            this.commandList[action].call(undefined, args, this);
        } else {
            action = parseInt(action, 10);
            if (action === this.current_sector.id) {
                console.log("You are already there, dummy!");
            } else if (this.current_sector.hasNeighbor(action)) {
                console.log("You warp to Sector " + action + " at light speed!");
                this.current_sector = this.universe.getSector(action);
            } else if (this.universe.hasSector(action)) {
                var mapper = new Mapper;
                var G      = mapper.buildGraph(this.universe);
                var path   = mapper.shortestPath(this.current_sector.id, action, G);
                console.log("Shortest path is " + path.length + " hops: " + path.join(" -> "));
            } else {
                console.log("You can't get there from here!");
            }
        }

        this.getInput();
    };

    this.help = function(args, game) {
        var help = Commands.Help;   
        return help.ask(args);
    };

    this.attack = function(args, game) {
        var attack = Commands.Attack;
        return attack.start(args, game);
    };

    this.status = function(args, game) {
        var player = Commands.Player;
        return player.status(args, game);
    };

    this.commandList = {
        "help"  : this.help,
        "attack": this.attack,
        "status": this.status,
    }
};

module.exports = Game;