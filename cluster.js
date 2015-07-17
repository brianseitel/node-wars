var Sector = require('./sector.js');

var Cluster = function(id, name) {
    this.id = id;
    this.name = name;
    this.sectors = [];

    this.addSector = function(sector) {
        if (typeof sector == "object") {
            this.sectors.push(sector.id);
        } else {
            console.log("This is not a sector!");
        }
        return this;
    }

    this.connect = function(cluster, universe) {
        var rand1 = Math.floor(Math.random() * this.sectors.length);
        var rand2 = Math.floor(Math.random() * cluster.sectors.length);

        var sector1 = this.sectors[rand1];
        var sector2 = cluster.sectors[rand2];

        var sector = universe.getSector(sector1);

        sector.addNeighbor(sector2);
    }
};

module.exports = Cluster;