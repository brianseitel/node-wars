var Sector   = require('./sector.js');
var Cluster  = require('./cluster.js');

var Universe = function() {
    this.sectors  = [];
    this.clusters = [];
    this.shops    = [];
    this.traders  = [];

    this.addShop = function(shop, sector) {
        id = null;
        if (typeof sector == "object") {
            id = sector.id;
        } else if (isInt(sector)) {
            id = sector;
        }

        shop.sector = id;
        this.shops.push(shop);
    }

    this.addTrader = function(trader, sector) {
         id = null;
        if (typeof sector == "object") {
            id = sector.id;
        } else if (isInt(sector)) {
            id = sector;
        }

        trader.sector = id;
        this.traders.push(trader);
    };

    this.addCluster = function(cluster) {
        this.clusters.push(cluster);
    }

    this.addSector = function(sector) {
        id = null;
        if (typeof sector == "object") {
            id = sector.id;
        } else if (isInt(sector)) {
            id = sector;
        }

        this.sectors[id] = sector;

        return this.sectors[id];
    }

    this.hasSector = function(sector) {
        var sector = this.getSector(sector);
        return !!sector;
    }

    this.getSector = function(sector) {
        id = null;
        if (typeof sector == "object") {
            id = sector.id;
        } else if (isInt(sector)) {
            id = sector;
        }

        if (id && this.sectors[id]) {
            return this.sectors[id];
        }

        return null;
    }

    this.getCluster = function(cluster) {
        return this.clusters[cluster];
    }
};

function isInt(n) {
    return Number(n)===n && n%1===0;
}

module.exports = Universe;
