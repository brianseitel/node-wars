var Universe = require('./models/universe.js');
var Helper   = require('./helpers.js');
var Mapper   = require('./mapper.js');
var Commands = require('./commands/commands.js');
var Shop     = require('./models/shop.js');
var fs       = require('fs');
var View     = require('./view.js');
 
var helpers = new Helper;
var prompt  = require('prompt');

var Game = function() {
    this.state          = null;
    this.universe       = new Universe;
    this.player         = null;
    this.current_sector = null;

    var states = {
        SPACE      : 0,
        IN_SHOP    : 1,
        IN_STARDOCK: 2,
    };

    this.start = function(universe, player) {
        this.state          = this.SPACE;
        this.universe       = helpers.load(this.universe);
        this.player         = helpers.loadPlayer();
        this.current_sector = this.universe.getSector(1);

        this.getInput();
    };

    this.setState = function(state) {
        switch(state) {
            case "IN_SHOP":
                this.state = states.IN_SHOP;
                break;
            default:
                this.state = states.SPACE;
        }

        return this.state;
    };

    this.getInput = function() {
        prompt.start();
        this.current_sector.neighbors.sort();

        switch(this.state) {
            case states.IN_SHOP: this.promptShop(); break;
            default:
                this.promptSpace();            
        }
    };

    this.promptShop = function() {
        var shop = this.current_sector.getShop(this.universe.shops);
        if (!shop) {
            this.state = states.SPACE;
            return this.getInput();
        }

        var view = new View('./views/shop.txt');
        prompt.message = view.render({shop : shop});
        prompt.get(['input'], this.processInput.bind(this));
    };

    this.promptSpace = function() {
        var shop = this.current_sector.getShop(this.universe.shops);
        var view = new View('./views/sector.txt');
        var data = {
            universe: this.universe,
            sector: this.current_sector,
            shop: shop
        };

        prompt.message = view.render(data);
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

    this.outpost = function(args, game) {
        var shop = Commands.Outpost;
        return shop.enter(args, game);
    };

    this.commandList = {
        "help"  : this.help,
        "attack": this.attack,
        "status": this.status,
        "o"     : this.outpost,
    };
};
String.prototype.paddingLeft = function (paddingValue, length) {
   return String(this + paddingValue).slice(0, length ? length : paddingValue.length);
};
module.exports = Game;