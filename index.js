var Sector   = require('./sector.js');
var Cluster  = require('./cluster.js');
var Universe = require('./universe.js');
var config   = require('./config.js');
var fs       = require('fs');
var Helper   = require('./helpers.js');
var Mapper   = require('./mapper.js');

var helpers = new Helper;
var maptool = new Mapper;

function bigBang() {
    var universe = new Universe();

    // Create sectors
    for (i = 1; i < config.NUM_SECTORS + 1; i++) {
        var sector = new Sector(i, "Sector "+i);
        universe.addSector(sector);
    }
    
    // Create clusters and populate with sectors
    var sectorList = universe.sectors.slice(0);

    var clusterCount = 0;
    while (sectorList.length > 0) {
        clusterCount++;
        var cluster = new Cluster(clusterCount, "Cluster " + clusterCount);
        var clusterSize = Math.floor(Math.random() * config.MAX_SECTORS_PER_CLUSTER) + parseInt(config.MIN_SECTORS_PER_CLUSTER, 10);

        for (var i = 0; i < clusterSize; i++) {
            sectorList = helpers.shuffle(sectorList);
            sector = sectorList.pop();

            if (!sector) {
                continue;
            }
            cluster.addSector(sector);
        }

        console.log("Cluster size: " + cluster.sectors.length);
        // Set neighbors for clusters
        for (var j = 0; j < cluster.sectors.length; j++) {
            var sector = universe.getSector(cluster.sectors[j]);
            var neighborCount = Math.floor(Math.random() * config.MAX_NEIGHBORS) + config.MIN_NEIGHBORS;
            var neighborList = cluster.sectors.slice(0);
            var inbound = false;
            var outbound = false;

            while (sector.neighbors.length < neighborCount) {
                neighborList = helpers.shuffle(neighborList);

                var neighbor = neighborList.pop();
                if (!neighbor) {
                    break;
                }

                while (neighbor == sector) {
                    neighbor = neighborList.pop();
                }

                var inboundChance = Math.floor(Math.random() * 100) + 1;
                if (!inbound || inboundChance < 50) {
                    sector.addNeighbor(neighbor);
                    inbound = true;
                } else if (!outbound || inboundChance >= 50) {
                    neighbor = universe.getSector(neighbor);
                    neighbor.addNeighbor(sector.id);
                    outbound = true;
                }
            }
        }
        universe.addCluster(cluster);
    }

    // hook up clusters
    for (var i = 0; i < universe.clusters.length; i++) {
        var cluster = universe.clusters[i];

        cluster1 = universe.getCluster(i);

        // Next cluster
        if (universe.clusters[i + 1]) {
            var clusterN = universe.getCluster(i + 1);
        } else {
            // Wrap around to first cluster
            var clusterN = universe.getCluster(0);
        }
        cluster1.connect(clusterN, universe);

        // Outbound cluster
        var outboundCluster = Math.floor(Math.random() * universe.clusters.length);
        while (outboundCluster === i) {
            outboundCluster = Math.floor(Math.random() * universe.clusters.length);
        }

        cluster2 = universe.getCluster(outboundCluster);
        cluster1.connect(cluster2, universe);

        // Inbound cluster
        var inboundCluster = Math.floor(Math.random() * universe.clusters.length);
        while (inboundCluster === i) {
            inboundCluster = Math.floor(Math.random() * universe.clusters.length);
        }

        cluster2 = universe.getCluster(inboundCluster);
        cluster2.connect(cluster1, universe);

        universe.clusters[i] = cluster;
    }

    return universe;
}


var universe = bigBang();

var sector = universe.getSector(1);

var nodes = [];
var links = [];

for (var c = 0; c < universe.clusters.length; c++) {
    var cluster = universe.clusters[c];
    for (var i = 0; i < cluster.sectors.length; i++) {
        var s = universe.getSector(cluster.sectors[i]);

        nodes.push({"id": s.id});

        for (var n = 0; n < s.neighbors.length; n++) {
            links.push({"source": s.id, "directed": true, "target": s.neighbors[n]});
        }
    }
}

fs.writeFile("map.json", JSON.stringify({"nodes": nodes, "links": links}));


// console.log(maptool.testPaths(universe));





// helpers.getInput(sector, universe);
// console.log(JSON.stringify({ "nodes": nodes, "links": links }));





