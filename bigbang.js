var Sector   = require('./models/sector.js');
var Cluster  = require('./models/cluster.js');
var Universe = require('./models/universe.js');
var Shop     = require('./models/shop.js');
var Trader   = require('./models/trader.js');
var config   = require('./config.js');
var fs       = require('fs');
var Helper   = require('./helpers.js');
var Mapper   = require('./mapper.js');

var helpers = new Helper;
var maptool = new Mapper;

var BigBang = function() {
    this.universe = new Universe;

    this.start = function() {
        this.initializeSectors();
        this.initializeClusters();
        this.connectClusters();
        this.initializeShops();
        this.initializeTraders();

        return this.universe;
    };

    this.initializeTraders = function() {
        var numTraders = Math.max(Math.floor(Math.random() * config.MAX_TRADERS), config.MIN_TRADERS);

        console.log(numTraders);
        var first_names = fs.readFileSync("data/first_names.txt", "utf8").split("\n");
        var last_names  = fs.readFileSync("data/last_names.txt", "utf8").split("\n");
        var visited = [];

        first_names = helpers.shuffle(first_names);
        last_names  = helpers.shuffle(last_names);
        for (var i = 0; i < numTraders; i++) {
            var sector = Math.floor(Math.random() * this.universe.sectors.length) + 1;

            var first_name = first_names.pop();
            var last_name  = last_names.pop();

            var trader = new Trader(i);
            trader.init();
            trader.name = first_name + " " + last_name;
            console.log("adding trader " + trader.name);
            this.universe.addTrader(trader, sector);
        }
    };

    this.initializeShops = function() {
        var counts = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
        };
        var numShops = Math.floor(config.NUM_SECTORS * config.SHOP_DENSITY);
        for (var i = 0; i < numShops; i++) {
            var sector = Math.floor(Math.random() * this.universe.sectors.length) + 1;

            var s = this.universe.getSector(i);
            if (s && s.getShop(this.universe.shops)) {
                continue;
            }
            var shop = new Shop(i);
            shop = shop.init();
            this.universe.addShop(shop, sector);

            counts[shop.type]++;
        }

        for (i in counts) {
            console.log("Class " + i + ": " + counts[i]);
        }
    };

    this.initializeSectors = function() {
        // Create sectors
        for (i = 1; i < config.NUM_SECTORS + 1; i++) {
            var sector = new Sector(i, "Sector "+i);
            this.universe.addSector(sector);
        }
    };

    this.initializeClusters = function() {
        // Create clusters and populate with sectors
        var sectorList = this.universe.sectors.slice(0);

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
                var sector = this.universe.getSector(cluster.sectors[j]);

                if (cluster.sectors[j + 1]) {
                    var neighbor = cluster.sectors[j + 1];
                    sector.addNeighbor(neighbor);
                }

                // Second pass, randomly add second connections
                var chance = Math.random();
                if (chance < config.TWO_WAY_RATIO) {
                    var sList = cluster.sectors.slice(0);
                    sList = helpers.shuffle(sList);
                    var neighbor = this.universe.getSector(sList.pop());
                    sector.addNeighbor(neighbor);
                }

            }
            // Third pass, randomly connect first and last sector
            var chance = Math.random();
            if (chance > config.ONE_WAY_RATIO) {
                var first = this.universe.getSector(cluster.sectors[0]);
                var last  = this.universe.getSector(cluster.sectors[cluster.sectors.length - 1]);

                last.addNeighbor(first);
            } else {
                for (var i = cluster.sectors.length - 1; i >= 0; i--) {
                    if (!cluster.sectors[i - 1]) break;
                    var s1 = this.universe.getSector(cluster.sectors[i]);
                    var s2 = this.universe.getSector(cluster.sectors[i - 1]);

                    s1.addNeighbor(s2);
                }
            }

            this.universe.addCluster(cluster);
        }
    },

    this.connectClusters = function() {
        // // hook up clusters
        if (this.universe.clusters.length > 1) {
            for (var i = 0; i < this.universe.clusters.length; i++) {
                var cluster = this.universe.clusters[i];

                cluster1 = this.universe.getCluster(i);

                // Next cluster
                if (this.universe.clusters[i + 1]) {
                    var clusterN = this.universe.getCluster(i + 1);
                } else {
                    // Wrap around to first cluster
                    var clusterN = this.universe.getCluster(0);
                }
                cluster1.connect(clusterN, this.universe);

                // // Outbound cluster
                var outboundCluster = Math.floor(Math.random() * this.universe.clusters.length / 4) + i;
                while (outboundCluster === i) {
                    outboundCluster = Math.floor(Math.random() * this.universe.clusters.length / 4) + i;
                }

                cluster2 = this.universe.getCluster(outboundCluster);
                if (cluster2) {
                    cluster1.connect(cluster2, this.universe);
                }

                // Inbound cluster
                var inboundCluster = Math.floor(Math.random() * this.universe.clusters.length / 4) + i;
                while (inboundCluster === i) {
                    inboundCluster = Math.floor(Math.random() * this.universe.clusters.length / 4) + i;
                }

                cluster2 = this.universe.getCluster(inboundCluster);
                if (cluster2) {
                    cluster2.connect(cluster1, this.universe);
                }
                this.universe.clusters[i] = cluster;
            }
        }
    };
};

module.exports = BigBang;