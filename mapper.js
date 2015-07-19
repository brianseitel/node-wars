var Graph    = require('node-dijkstra');
var Mapper = function() {

    this.buildGraph = function(universe) {
        var g = new Graph;
        for (var i = 1; i < universe.sectors.length; i++) {
            var sector = universe.getSector(i);
            var edges = {};

            for (var n = 0; n < sector.neighbors.length; n++) {
                edges[sector.neighbors[n]] = 1;
            }

            g.addVertex(i, edges);
        }

        return g;
    },

    this.shortestPath = function(start, finish, G) {
        var shortest = G.shortestPath(start.toString(), finish.toString());

        var path = [];
        for (var i = 0; i < shortest.length; i++) {
            path.push(parseInt(shortest[i]));
        }
        return path;
    },

    this.testPaths = function(universe) {
        var mapper = new Mapper();

        var g = mapper.buildGraph(universe);

        var fails    = 0;
        var total    = 0;
        var quickest = 1000000;
        var longest  = 0;

        console.log("Testing paths...");
        for (var i = 1; i < universe.sectors.length; i++) {
            for (var j = 1; j < universe.sectors.length; j++) {
                if (j === i) {
                    continue;
                }

                if (!universe.sectors[i]) {
                    continue;
                }


                var shortest = g.shortestPath(i.toString(), j.toString());
                // console.log("["+i+" => "+j+"]: " + shortest);

                if (!shortest) {
                    fails++;
                } else {
                    quickest = shortest.length < quickest ? shortest.length : quickest;
                    longest  = shortest.length > longest  ? shortest.length : longest;
                }
                total++;
            }
        }
        console.log("Total routes:          " + total);
        console.log("Reachable routes:      " + (total - fails));
        console.log("Unreachable:           " + fails);
        console.log("Shortest route length: " + quickest);
        console.log("Longest route length:  " + longest);

        return fails === 0;
    }
}

module.exports = Mapper;