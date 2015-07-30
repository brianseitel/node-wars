var Sector   = require('./sector');
var Cluster  = require('./cluster');

var Universe = function() {
    this.sectors  = [];
    this.clusters = [];
    this.shops    = [];
    this.traders  = [];
};

Universe.prototype.addShop = function(shop, sector) {
    id = null;
    if (typeof sector == "object") {
        id = sector.id;
    } else if (isInt(sector)) {
        id = sector;
    }

    shop.sector = id;
    this.shops.push(shop);
};

Universe.prototype.addTrader = function(trader, sector) {
     id = null;
    if (typeof sector == "object") {
        id = sector.id;
    } else if (isInt(sector)) {
        id = sector;
    }

    trader.sector = id;
    this.traders.push(trader);
};

Universe.prototype.addCluster = function(cluster) {
    this.clusters.push(cluster);
};

Universe.prototype.addSector = function(sector) {
    id = null;
    if (typeof sector == "object") {
        id = sector.id;
    } else if (isInt(sector)) {
        id = sector;
    }

    this.sectors[id] = sector;

    return this.sectors[id];
};

Universe.prototype.hasSector = function(sector) {
    var sector = this.getSector(sector);
    return !!sector;
};

Universe.prototype.getSector = function(sector) {
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
};

Universe.prototype.getCluster = function(cluster) {
    return this.clusters[cluster];
};

function isInt(n) {
    return Number(n)===n && n%1===0;
}

module.exports = Universe;
