var config   = require('../config.js');

var Shop = function(id) {
    this.id     = id;
    this.sector = null;
    this.bank   = 0;
    this.type   = 1;
    this.prices = {
        fuel     : 10,
        organics : 10,
        equipment: 10,
    };

    this._type = "";

    this.init = function() {

        // Pick the type of port
        var chance = Math.floor(Math.random * 100);

        switch(1) {
            case chance < 20:  this.type = 1; break; // 20% chance of Type 1
            case chance < 40:  this.type = 2; break; // 20% chance of Type 2
            case chance < 60:  this.type = 3; break; // 20% chance of Type 3
            case chance < 70:  this.type = 4; break; // 10% chance of Type 4
            case chance < 80:  this.type = 5; break; // 10% chance of Type 5
            case chance < 90:  this.type = 6; break; // 10% chance of Type 6
            case chance < 95:  this.type = 7; break; // 5% chance of Type 7
            case chance < 100: this.type = 8; break; // 5% chance of Type 8
        }
        
        this.bank = Math.floor(Math.random() * config.SHOP_AVERAGE_BANKROLL) + config.SHOP_MIN_BANKROLL;

        var fuel_price      = Math.floor(Math.random() * config.FUEL_STANDARD_PRICE) + config.FUEL_MIN_PRICE;
        var organics_price  = Math.floor(Math.random() * config.ORGANICS_STANDARD_PRICE) + config.ORGANICS_MIN_PRICE;
        var equipment_price = Math.floor(Math.random() * config.EQUIPMENT_STANDARD_PRICE) + config.EQUIPMENT_MIN_PRICE;

        this.prices = {};
        this.prices.fuel      = fuel_price;
        this.prices.organics  = organics_price;
        this.prices.equipment = equipment_price;

        this._type = this.types[this.type];
        return this;
    }

    this.inventory = function() {
        return "[" + this.types[this.type] + "]";
    }

    this.findShop = function(universe, sector) {
        for (i in universe.shops) {
            if (universe.shops[i].sector == sector) {
                return universe.shops[i];
            }
        }

        return false;
    }

/*
    Type 1 - (BBS) - buying fuel ore, buying organics, selling equipment
    Type 2 - (BSB) - buying fuel ore, selling organics, buying equipment
    Type 3 - (SBB) - selling fuel ore, buying organics, buying equipment
    Type 4 - (SSB) - selling fuel ore, selling organics, buying equipment
    Type 5 - (SBS) - selling fuel ore, buying organics, selling equipment
    Type 6 - (BSS) - buying fuel ore, selling organics, selling equipment
    Type 7 - (SSS) - selling fuel ore, selling organics, selling equipment
    Type 8 - (BBB) - buying fuel ore, buying organics, buying equipment
 */

    this.types = {
        1: "BBS",
        2: "BSB",
        3: "SBB",
        4: "SSB",
        5: "SBS",
        6: "BSS",
        7: "SSS",
        8: "BBB"
    };
}

module.exports = Shop;