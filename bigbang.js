var Sector   = require('./sector.js');
var Cluster  = require('./cluster.js');
var Universe = require('./universe.js');
var config   = require('./config.js');
var fs       = require('fs');
var Helper   = require('./helpers.js');
var Mapper   = require('./mapper.js');

var helpers = new Helper;
var maptool = new Mapper;

var BigBang = function() {

    this.start = function() {
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
            var clusterSize = Math.floor(Math.random() * (config.MAX_SECTORS_PER_CLUSTER - config.MIN_SECTORS_PER_CLUSTER)) + config.MIN_SECTORS_PER_CLUSTER;
            while (sectorList.length > 0 && cluster.sectors.length < clusterSize) {
                sectorList = helpers.shuffle(sectorList);
                sector = sectorList.pop();

                if (!sector) {
                    if (sectorList.length > 0) {
                        continue;
                    }
                    break;
                }
                cluster.addSector(sector);
            }

            if (sectorList.length < config.MIN_SECTORS_PER_CLUSTER) {
                while (sectorList.length > 0) {
                    sector = sectorList.pop();
                    if (sector)
                        cluster.addSector(sector);
                }
            }

            if (cluster.sectors.length === 0) {
                break;
            }

            // Set neighbors for clusters
            for (var j = 0; j < cluster.sectors.length; j++) {
                var sector = universe.getSector(cluster.sectors[j]);

                if (cluster.sectors[j + 1]) {
                    var neighbor = cluster.sectors[j + 1];
                    sector.addNeighbor(neighbor);
                }

                // Second pass, randomly add second connections
                var chance = Math.random();
                if (chance < config.TWO_WAY_RATIO) {
                    var sList = cluster.sectors.slice(0);
                    sList = helpers.shuffle(sList);
                    var neighbor = universe.getSector(sList.pop());
                    sector.addNeighbor(neighbor);
                }

            }
            // Third pass, randomly connect first and last sector
            var chance = Math.random();
            if (chance > config.ONE_WAY_RATIO) {
                var first = universe.getSector(cluster.sectors[0]);
                var last  = universe.getSector(cluster.sectors[cluster.sectors.length - 1]);

                last.addNeighbor(first);
            } else {
                for (var i = cluster.sectors.length - 1; i >= 0; i--) {
                    if (!cluster.sectors[i - 1]) break;
                    var s1 = universe.getSector(cluster.sectors[i]);
                    var s2 = universe.getSector(cluster.sectors[i - 1]);

                    s1.addNeighbor(s2);
                }
            }

            universe.addCluster(cluster);
        }

        // // hook up clusters
        if (universe.clusters.length > 1) {
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

                // // Outbound cluster
                var outboundCluster = Math.floor(Math.random() * universe.clusters.length / 4) + i;
                while (outboundCluster === i) {
                    outboundCluster = Math.floor(Math.random() * universe.clusters.length / 4) + i;
                }

                cluster2 = universe.getCluster(outboundCluster);
                if (cluster2) {
                    cluster1.connect(cluster2, universe);
                }

                // Inbound cluster
                var inboundCluster = Math.floor(Math.random() * universe.clusters.length / 4) + i;
                while (inboundCluster === i) {
                    inboundCluster = Math.floor(Math.random() * universe.clusters.length / 4) + i;
                }

                cluster2 = universe.getCluster(inboundCluster);
                if (cluster2) {
                    cluster2.connect(cluster1, universe);
                }
                universe.clusters[i] = cluster;
            }
        }

        return universe;
    };
};

module.exports = BigBang;