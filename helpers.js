var prompt   = require('prompt');
var Universe = require('./models/universe.js');
var Sector   = require('./models/sector.js');
var Shop     = require('./models/shop.js');
var Mapper   = require('./mapper.js');
var Player   = require('./models/player.js');
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
    },

    this.saveShops = function(universe) {
        fs.writeFile("data/shops.json", JSON.stringify({
            "shops": universe.shops
        }));
    };

    this.saveMap = function(universe) {
        var nodes = [];
        var links = [];
        var clusters = [];
        var sectors  = [];
        for (var c = 0; c < universe.clusters.length; c++) {
            var cluster = universe.clusters[c];
            for (var i = 0; i < cluster.sectors.length; i++) {
                var s = universe.getSector(cluster.sectors[i]);

                nodes.push({"id": s.id});

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
            var shop = new Shop;
            shop.buy    = data.buy;
            shop.sell   = data.sell;
            shop.bank   = data.bank;

            shop.goods = data.goods;

            universe.addShop(shop, data.sector);
        }

        return universe;
    }

    this.loadPlayer = function() {
        var json = JSON.parse(fs.readFileSync('data/player.json', 'utf8'));

        var player = new Player;

        player.name    = json.name;
        player.level   = json.level;
        player.credits = json.credits;
        player.cargo   = {
            ore    : json.cargo.ore,
            fuel   : json.cargo.fuel,
            weapons: json.cargo.weapons
        };

        return player;
    }
};

var helpers = new Helper();
module.exports = Helper;