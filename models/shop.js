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

    this.inventory = {
        fuel     : 100,
        organics : 50,
        equipment: 25,
    }

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

        var price_fuel      = Math.floor(Math.random() * config.PRICE_FUEL_STANDARD) + config.PRICE_FUEL_MIN;
        var price_organics  = Math.floor(Math.random() * config.PRICE_ORGANICS_STANDARD) + config.PRICE_ORGANICS_MIN;
        var price_equipment = Math.floor(Math.random() * config.PRICE_EQUIPMENT_STANDARD) + config.PRICE_EQUIPMENT_MIN;
        
        this.prices = {};
        this.prices.fuel      = price_fuel;
        this.prices.organics  = price_organics;
        this.prices.equipment = price_equipment;

        var inventory_fuel  = Math.floor(Math.random() * config.INVENTORY_FUEL_STANDARD) + config.INVENTORY_FUEL_MIN;
        var inventory_organics = Math.floor(Math.random() * config.INVENTORY_ORGANICS_STANDARD) + config.INVENTORY_ORGANICS_MIN;
        var inventory_equipment = Math.floor(Math.random() * config.INVENTORY_EQUIPMENT_STANDARD) + config.INVENTORY_EQUIPMENT_MIN;

        this.inventory = {
            fuel: inventory_fuel,
            organics: inventory_organics,
            equipment: inventory_equipment
        };

        this._type = this.types[this.type];
        return this;
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