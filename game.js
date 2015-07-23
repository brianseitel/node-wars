var Universe = require('./models/universe.js');
var Helper   = require('./helpers.js');
var Mapper   = require('./mapper.js');
var Commands = require('./commands/commands.js');
var Shop     = require('./models/shop.js');
var fs       = require('fs');
var View     = require('./view.js');
 
var helpers = new Helper;
var prompt  = require('prompt');
var async   = require('async');
var bunyan  = require('bunyan');

var Game = function() {
    this.state          = null;
    this.universe       = new Universe;
    this.player         = null;
    this.current_sector = null;

    this.logger         = bunyan.createLogger({
        name: 'nodewars',
        streams: [
            {
                level: 'info',
                path: 'logs/events.log'
            },
            {
                level: 'error',
                path: 'logs/errors.log'
            }
        ]
    });
    this.intervals      = [];

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

        async.parallel([
            (function() {
                this.getInput();
            }).bind(this),
            (function() {
                this.update();
            }).bind(this)
        ]);
    };

    this.update = function() {
        this.intervals["main_loop"] = setInterval(function() {
            this.logger.info("tick tock");
            this.refreshShops();
        }.bind(this), 1000);
    };

    this.refreshShops = function() {
        if ((new Date).getMinutes() === 15) {
            this.logger.info("Refreshing shops");
            for (i in this.universe.shops) {
                this.universe.shops[i].update(game);
            }
        } else {
            this.logger.info("Not time to refresh shops...");
        }
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

        extras = { holdsRemaining: this.player.holdsRemaining() };
        var view = new View('./views/shop.txt');
        prompt.message = view.render({shop : shop, player: this.player, extras: extras});
        return prompt;
    };

    this.promptSpace = function() {
        var view = new View('./views/sector.txt');
        var data = {
            universe: this.universe,
            sector: this.current_sector,
            shop: this.current_sector.getShop(this.universe.shops),
            traders: this.current_sector.getTraders(this.universe.traders)
        };

        prompt.message = view.render(data);
        return prompt;
    };

    this.exit = function() {
        helpers.save(this.universe); 
        helpers.savePlayer(this.player);
        for (i in this.intervals) {
            clearTimeout(this.intervals[i]);
        }
        return 1;
    };

    this.processInput = function(err, result) {
        if (err) { return helpers.onErr(err); }
        if (["quit","exit","done"].indexOf(result.input) > -1) {
            return this.exit();
        }

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