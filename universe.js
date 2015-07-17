var Sector   = require('./sector.js');
var Cluster  = require('./cluster.js');

var Universe = function() {
    this.sectors = [];
    this.clusters = [];

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
