var prompt   = require('prompt');
var Universe = require('./universe.js');
var Sector   = require('./sector.js');
var Mapper   = require('./mapper.js');
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

    this.getInput = function(sector, universe) {
        prompt.start();
        sector.neighbors.sort();
        prompt.message = "You are in " + sector.name + ". Neighbors: [" + sector.neighbors.join(", ") + "]";
        prompt.get(['input'], function(err, result) {
            if (err) { return helpers.onErr(err); }

            if (result.input == 'done') {
                console.log("Bye!");
                return 1;
            }

            if (parseInt(result.input)) {
                var input = parseInt(result.input);

                if (input === sector.id) {
                    console.log("You are already there, dummy!");
                } else if (sector.hasNeighbor(input)) {
                    console.log("You warp to Sector " + input + " at light speed!");
                    sector = universe.getSector(input);
                } else if (universe.hasSector(input)) {
                    var mapper = new Mapper;
                    var G = mapper.buildGraph(universe);
                    var path = mapper.shortestPath(sector.id, input, G);
                    console.log("Shortest path is " + path.length + " hops: " + path.join(" -> "));
                } else {
                    console.log("You can't get there from here!");
                }

            } else {
                console.log("Invalid input. Try again.");
            }
             helpers.getInput(sector, universe);
        });
    },

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

        fs.writeFile("map.json", JSON.stringify({
            "sectors": sectors,
            "clusters": clusters,
            "nodes": nodes,
            "links": links
        }));
    },

    this.loadMap = function() {
        var json = JSON.parse(fs.readFileSync('map.json', 'utf8'));

        var universe = new Universe;
        for (i in json.sectors) {
            var sector = new Sector(json.sectors[i].id, json.sectors[i].name);
            sector.neighbors = json.sectors[i].neighbors;
            universe.addSector(sector);
        }

        for (c in json.clusters) {
            universe.addCluster(json.clusters[c]);
        }

        return universe;
    }
};

var helpers = new Helper();
module.exports = Helper;