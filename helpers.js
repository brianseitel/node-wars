var prompt   = require('prompt');
var Universe = require('./models/universe.js');
var Sector   = require('./models/sector.js');
var Shop     = require('./models/shop.js');
var Mapper   = require('./mapper.js');
var Player   = require('./models/player.js');
var Trader   = require('./models/trader.js');
var fs       = require('fs');

var Helper = function() {

    this.shuffle = function(o) {
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    },

    this.onErr = function(err) {
        console.log(err);
        return 1;
    },

    this.save = function(universe) {
        this.saveMap(universe);
        this.saveUniverse(universe);
        this.saveShops(universe);
        this.saveTraders(universe);
    },

    this.savePlayer = function(player) {
        fs.writeFile("data/player.json", JSON.stringify(player));
    };

    this.saveShops = function(universe) {
        fs.writeFile("data/shops.json", JSON.stringify({
            "shops": universe.shops
        }));
    };

    this.saveTraders = function(universe) {
        fs.writeFile("data/traders.json", JSON.stringify({
            "traders": universe.traders
        }));
    }

    this.saveMap = function(universe) {
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
    },

    this.saveUniverse = function(universe) {
        fs.writeFile("data/universe.json", JSON.stringify(universe));
    }

    this.load = function(universe) {
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

        var json = JSON.parse(fs.readFileSync('data/shops.json', 'utf8'));

        for (s in json.shops) {
            if (!json.shops[s]) continue;
            var data = json.shops[s];
            var shop = new Shop(data.id);
            shop.type   = data.type;
            shop._type  = shop.types[shop.type];
            shop._typeDisplay = shop.colorType();
            shop.bank   = data.bank;
            shop.prices = data.prices;
            shop.inventory = data.inventory;
            
            universe.addShop(shop, data.sector);
        }

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

            universe.addTrader(trader, data.sector);
        }

        return universe;
    }

    this.loadPlayer = function() {
        var json = JSON.parse(fs.readFileSync('data/player.json', 'utf8'));

        var player = new Player;

        player.name    = json.name;
        player.level   = json.level;
        player.credits = json.credits;
        player.ship    = json.ship;
        player.holds   = json.holds;
        player.cargo   = {
            fuel      : json.cargo.fuel,
            organics  : json.cargo.organics,
            equipment : json.cargo.equipment
        };

        return player;
    }
};

var helpers = new Helper();
module.exports = Helper;