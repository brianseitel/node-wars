var Universe = require('./universe');
var Sector   = require('./sector');

var Sector = function(id, name) {
    this.id        = id;
    this.name      = name;
    this.neighbors = [];
};

Sector.prototype.getShop = function(shops) {
    for (i in shops) {
        if (shops[i].sector == this.id) {
            return shops[i];
        }
    }

    return false;
};

Sector.prototype.getTraders = function(traders) {
    var t = [];
    for (i in traders) {
        if (traders[i].sector == this.id) {
            t.push(traders[i]);
        }
    }

    return t;
};

Sector.prototype.addNeighbor = function(neighbor) {
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
};

Sector.prototype.getNeighbors = function() {
    return this.neighbors;
};

Sector.prototype.hasNeighbor = function(neighbor) {
    for (var i = 0; i < this.neighbors.length; i++) {
        if (this.neighbors[i] === neighbor) {
            return true;
        }
    }

    return false;
};

module.exports = Sector;