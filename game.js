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
        this.state          = states.SPACE;
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

    this.getInput = function(message) {
        prompt.start();

        if (message) {
            prompt.message = message;
        } else {
            switch(this.state) {
                case states.IN_SHOP: prompt = this.promptShop(); break;
                default:
                    prompt = this.promptSpace();            
            }
        }
        prompt.get(['input'], this.processInput.bind(this));
    };

    this.promptShop = function() {
        var shop = this.current_sector.getShop(this.universe.shops);
        if (!shop) {
            this.state = states.SPACE;
            return this.getInput();
        }

        var view = new View('./views/shop.txt');
        prompt.message = view.render({shop : shop, player: this.player});
        return prompt;
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
        return prompt;
    };

    this.processInput = function(err, result) {
        if (err) { return helpers.onErr(err); }
        if (result.input == 'done') { return 1; }

        var message = "";
        var args    = result.input.split(' ');
        var action  = args.shift().toLowerCase();
        if (this.commandList[action]) {
            message = this.commandList[action].call(undefined, args, this);
        } else {
            // Default action is to move.
            message = this.commandList["move"].call(undefined, [action], this);
        }

        this.getInput(message);
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

    this.move = function(args, game) {
        var player = Commands.Player;
        return player.move(args, game);
    };

    this.leave = function(args, game) {
        if (game.state == states.IN_SHOP) {
            var outpost = Commands.Outpost;
            return outpost.leave(args, game);
        }
    }

    this.buy = function(args, game) {
        if (game.state == states.IN_SHOP) {
            var outpost = Commands.Outpost;
            return outpost.buy(args, game);
        } else {
            return "Oops! You can't do that here.\n";
        }
    };

    this.sell = function(args, game) {
        if (game.state == states.IN_SHOP) {
            var outpost = Commands.Outpost;
            return outpost.sell(args, game);
        } else {
            return "Oops! You can't do that here.\n";
        }
    };

    this.commandList = {
        "help"  : this.help,
        "attack": this.attack,
        "status": this.status,
        "o"     : this.outpost,
        "leave" : this.leave,
        "move"  : this.move,
        "buy"   : this.buy,
        "sell"  : this.sell,
    };
};
String.prototype.paddingLeft = function (paddingValue, length) {
   return String(this + paddingValue).slice(0, length ? length : paddingValue.length);
};
module.exports = Game;