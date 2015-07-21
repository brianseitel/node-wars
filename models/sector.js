var Universe = require('./universe.js');
var Sector = require('./sector.js');

var Sector = function(id, name) {
    this.id        = id;
    this.name      = name;
    this.neighbors = [];

    this.getShop = function(shops) {
        for (i in shops) {
            if (shops[i].sector == this.id) {
                return shops[i];
            }
        }

        return false;
    };

    this.addNeighbor = function(neighbor) {
        var id = null;
        if (neighbor instanceof Sector) {
            id = neighbor.id
        } else {
            id = neighbor;
            // console.log("This is not a neighboring sector!");
        }

        if (!id || id === this.id) {
            return this;
        }

        for (var i = 0; i < this.neighbors.length; i++) {
            if (this.neighbors[i] == id) {
                return this;
            }
        }

        this.neighbors.push(id);
        return this;
    }

    this.getNeighbors = function() {
        return this.neighbors;
    }

    this.hasNeighbor = function(neighbor) {
        for (var i = 0; i < this.neighbors.length; i++) {
            if (this.neighbors[i] === neighbor) {
                return true;
            }
        }

        return false;
    }
};

module.exports = Sector;