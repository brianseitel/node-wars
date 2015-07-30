var Universe = require('./models/universe');
var Helper   = require('./helpers');
var Mapper   = require('./mapper');
var Commands = require('./commands/commands');
var Shop     = require('./models/shop');
var fs       = require('fs');
var View     = require('./view');
var EventEmitter    = require('events').EventEmitter;

var prompt  = require('prompt');
var async   = require('async');
var bunyan  = require('bunyan');

var Game = function() {
    this.state          = null;
    this.universe       = new Universe;
    this.player         = null;
    this.current_sector = null;
    this.emitter        = new EventEmitter;

    this.emitter.setMaxListeners(100);

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

    this.states = {
        SPACE      : 0,
        IN_SHOP    : 1,
        IN_STARDOCK: 2,
        JUMPING    : 3,
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
        "jump"  : this.jump,
    };
};

Game.prototype.start = function() {
    this.state          = this.states.SPACE;
    this.universe       = Helper.load(this);
    this.player         = Helper.loadPlayer(this);
    this.current_sector = this.universe.getSector(this.player.sector);

    async.parallel([
        (function() {
            this.getInput();
        }).bind(this),
        (function() {
            this.update();
        }).bind(this)
    ]);
};

Game.prototype.update = function() {
    this.intervals["main_loop"] = setInterval(function() {
        this.logger.info("tick tock");
        this.emitter.emit('tick', this);
    }.bind(this), 1000);
};
    
Game.prototype.inSpace = function() {
    return this.state === this.states.SPACE;
};

Game.prototype.setState = function(state) {
    switch(state) {
        case "IN_SHOP":
            this.state = this.states.IN_SHOP;
            break;
        case "JUMPING":
            this.state = this.states.JUMPING;
            break;
        case "SPACE":
        default:
            this.state = this.states.SPACE;
    }

    return this.state;
};

Game.prototype.getInput = function(message) {
    prompt.start();

    if (message) {
        prompt.message = message;
    } else {
        switch(this.state) {
            case this.states.IN_SHOP: prompt = this.promptShop(); break;
            case this.states.JUMPING: return;
            default:
                prompt = this.promptSpace();            
        }
    }
    prompt.get(['input'], this.processInput.bind(this));
};

Game.prototype.promptShop = function() {
    var shop = this.current_sector.getShop(this.universe.shops);
    if (!shop) {
        this.state = this.states.SPACE;
        return this.getInput();
    }

    extras = { holdsRemaining: this.player.holdsRemaining() };
    var view = new View('./views/shop.txt');
    prompt.message = view.render({shop : shop, player: this.player, extras: extras});
    return prompt;
};

Game.prototype.promptSpace = function() {
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

Game.prototype.exit = function() {
    Helper.save(this.universe); 
    Helper.savePlayer(this.player);
    for (i in this.intervals) {
        clearTimeout(this.intervals[i]);
    }
    return 1;
};

Game.prototype.processInput = function(err, result) {
    if (err) { return Helper.onErr(err); }
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

Game.prototype.help = function(args, game) {
    var help = Commands.Help;
    return help.ask(args);
};

Game.prototype.attack = function(args, game) {
    if (!game.inSpace()) return;
    var attack = Commands.Attack;
    return attack.start(args, game);
};

Game.prototype.status = function(args, game) {
    var player = Commands.Player;
    return player.status(args, game);
};

Game.prototype.outpost = function(args, game) {
    var shop = Commands.Outpost;
    return shop.enter(args, game);
};

Game.prototype.move = function(args, game) {
    if (!game.inSpace()) return;
    var player = Commands.Player;
    return player.move(args, game);
};

Game.prototype.jump = function(args, game) {
    if (!game.inSpace()) return;
    var player = Commands.Player;
    return player.jump(args, game);
};

Game.prototype.leave = function(args, game) {
    if (game.state == game.states.IN_SHOP) {
        var outpost = Commands.Outpost;
        return outpost.leave(args, game);
    }
};

Game.prototype.buy = function(args, game) {
    if (game.state == game.states.IN_SHOP) {
        var outpost = Commands.Outpost;
        return outpost.buy(args, game);
    }
};

Game.prototype.sell = function(args, game) {
    if (game.state == game.states.IN_SHOP) {
        var outpost = Commands.Outpost;
        return outpost.sell(args, game);
    }
};

String.prototype.paddingLeft = function (paddingValue, length) {
   return String(this + paddingValue).slice(0, length ? length : paddingValue.length);
};
module.exports = Game;