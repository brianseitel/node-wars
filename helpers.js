var prompt   = require('prompt');
var Universe = require('./models/universe');
var Sector   = require('./models/sector');
var Shop     = require('./models/shop');
var Mapper   = require('./mapper');
var Player   = require('./models/player');
var Trader   = require('./models/trader');
var fs       = require('fs');

var Helper = function() {};

Helper.prototype.shuffle = function(o) {
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

Helper.prototype.onErr = function(err) {
    console.log(err);
    return 1;
};

Helper.prototype.save = function(universe) {
    this.saveMap(universe);
    this.saveUniverse(universe);
    this.saveShops(universe);
    this.saveTraders(universe);
};

Helper.prototype.savePlayer = function(player) {
    fs.writeFile("data/player.json", JSON.stringify(player));
};

Helper.prototype.saveShops = function(universe) {
    fs.writeFile("data/shops.json", JSON.stringify({
        "shops": universe.shops
    }));
};

Helper.prototype.saveTraders = function(universe) {
    fs.writeFile("data/traders.json", JSON.stringify({
        "traders": universe.traders
    }));
};

Helper.prototype.saveMap = function(universe) {
    var nodes = [];
    var links = [];
    var clusters = [];
    var sectors  = [];
    for (var c = 0; c < universe.clusters.length; c++) {
        var cluster = universe.clusters[c];
        for (var i = 0; i < cluster.sectors.length; i++) {
            var s = universe.getSector(cluster.sectors[i]);

            var hasShop = !!s.getShop(universe.shops);
            nodes.push({"id": s.id, "fill": hasShop ? "red" : "blue"});

            for (var n = 0; n < s.neighbors.length; n++) {
                links.push({"source": s.id, "directed": true, "target": s.neighbors[n]});
            }
            sectors.push(s);
        }
        clusters.push(cluster);
    }

    fs.writeFile("data/map.json", JSON.stringify({
        "nodes": nodes,
        "links": links
    }));
};

Helper.prototype.saveUniverse = function(universe) {
    fs.writeFile("data/universe.json", JSON.stringify(universe));
};

Helper.prototype.load = function(game) {
    universe = this.loadUniverse(game);
    universe = this.loadShops(game);
    universe = this.loadTraders(game);
    return universe;
};

Helper.prototype.loadUniverse = function(game) {
    var universe = game.universe;
    var emitter  = game.emitter;
    var json = JSON.parse(fs.readFileSync('data/universe.json', 'utf8'));

    for (i in json.sectors) {
        if (!json.sectors[i]) continue;
        var sector = new Sector(json.sectors[i].id, json.sectors[i].name);
        sector.neighbors = json.sectors[i].neighbors;
        universe.addSector(sector);
    }

    for (c in json.clusters) {
        universe.addCluster(json.clusters[c]);
    }

    return universe;
};

Helper.prototype.loadShops = function(game) {
    var universe = game.universe;
    var emitter  = game.emitter;
    var json = JSON.parse(fs.readFileSync('data/shops.json', 'utf8'));

    for (s in json.shops) {
        if (!json.shops[s]) continue;
        var data = json.shops[s];
        var shop = new Shop(data.id, emitter);
        shop.type   = data.type;
        shop._type        = shop.types[shop.type];

        shop._typeDisplay = shop.colorType();
        shop.bank         = data.bank;
        shop.prices       = data.prices;
        shop.inventory    = data.inventory;
        
        emitter.on('tick', function(game) {
            shop.update(game);
        }.bind(shop));
        universe.addShop(shop, data.sector);
    }
    return universe;
};

Helper.prototype.loadTraders = function(game) {
    var universe = game.universe;
    var emitter  = game.emitter;
    var json = JSON.parse(fs.readFileSync("data/traders.json", "utf8"));

    for (s in json.traders) {
        if (!json.traders[s]) continue;

        var data = json.traders[s];
        var trader = new Trader(data.id);
        trader.name    = data.name;
        trader.level   = data.level;
        trader.credits = data.credits;
        trader.ship    = data.ship;
        trader.holds   = data.holds;
        trader.cargo   = {
            fuel      : data.cargo.fuel,
            organics  : data.cargo.organics,
            equipment : data.cargo.equipment
        };

        emitter.on('tick', function(game) {
            trader.update(game);
        }.bind(trader));
        universe.addTrader(trader, data.sector);
    }

    return universe;
};

Helper.prototype.loadPlayer = function(game) {
    var emitter = game.emitter;
    var json = JSON.parse(fs.readFileSync('data/player.json', 'utf8'));

    var player = new Player;

    player.name    = json.name;
    player.sector  = json.sector;
    player.level   = json.level;
    player.credits = json.credits;
    player.ship    = json.ship;
    player.holds   = json.holds;
    player.cargo   = {
        fuel      : json.cargo.fuel,
        organics  : json.cargo.organics,
        equipment : json.cargo.equipment
    };

    emitter.on('trader.move', function(trader, old, next) {
        if (old == player.sector) {
            player.broadcast(trader.name + " just warped out of this sector.", game);
        } else if (trader.sector == player.sector) {
            player.broadcast(trader.name + " just warped into this sector.", game);
        }
    }.bind(player));
    return player;
};

module.exports = new Helper;