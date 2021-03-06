var config       = require('node-yaml-config').load('./config/game.yml');
var util         = require('util');
var EventEmitter = require('events').EventEmitter;

var Shop = function(id, emitter) {
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

    // The problem with the current templating language is that I can't
    // call functions within the template, so I have to have a _typeDisplay
    // to store an attribute that I would normally call a function to calculate
    // on the fly. There's gotta be a better way to handle this.
    this._type        = "";
    this._typeDisplay = "";

    EventEmitter.call(this);
};

Shop.prototype.init = function() {
    // Pick the type of port
    var chance = Math.floor(Math.random() * 100);
    switch(true) {
        case chance < 20:  this.type = 1; break; // 20% chance of Type 1
        case chance < 40:  this.type = 2; break; // 20% chance of Type 2
        case chance < 60:  this.type = 3; break; // 20% chance of Type 3
        case chance < 70:  this.type = 4; break; // 10% chance of Type 4
        case chance < 80:  this.type = 5; break; // 10% chance of Type 5
        case chance < 90:  this.type = 6; break; // 10% chance of Type 6
        case chance < 95:  this.type = 7; break; // 5% chance of Type 7
        case chance < 100: this.type = 8; break; // 5% chance of Type 8
    }
    
    this.bank = Math.floor(Math.random() * config.outposts.bankroll.max) + config.outposts.bankroll.min;

    this.stockShop();

    this._type        = this.types[this.type];
    this._typeDisplay = this.colorType();
    return this;
};

Shop.prototype.update = function(game) {
    // Don't update the sector if the player is in it!
    if (game.current_sector == this.sector) {
        return;
    }
    var chance = Math.floor(Math.random() * 100);
    if (chance === 1) {
        this.stockShop();
        this.depositBank();
    }
};

Shop.prototype.depositBank = function() {
    var income = Math.floor(Math.random()) + 1;
    this.bank = this.bank * income; // up to double the moolah.
};

Shop.prototype.stockShop = function() {
    var price_fuel      = Math.floor(Math.random() * config.outposts.items.fuel.price.standard) + config.outposts.items.fuel.price.min;
    var price_organics  = Math.floor(Math.random() * config.outposts.items.organics.price.standard) + config.outposts.items.organics.price.min;
    var price_equipment = Math.floor(Math.random() * config.outposts.items.equipment.price.standard) + config.outposts.items.equipment.price.min;
    
    this.prices = {};
    this.prices.fuel      = price_fuel;
    this.prices.organics  = price_organics;
    this.prices.equipment = price_equipment;

    var inventory_fuel      = Math.floor(Math.random() * config.outposts.items.fuel.inventory.standard) + config.outposts.items.fuel.inventory.min;
    var inventory_organics  = Math.floor(Math.random() * config.outposts.items.organics.inventory.standard) + config.outposts.items.organics.inventory.min;
    var inventory_equipment = Math.floor(Math.random() * config.outposts.items.equipment.inventory.standard) + config.outposts.items.equipment.inventory.min;

    this.inventory = {
        fuel:      inventory_fuel,
        organics:  inventory_organics,
        equipment: inventory_equipment
    };
};

Shop.prototype.colorType = function() {
    var result = "";

    var t = this.types[this.type].split("");
    for (i in t) {
        result += t[i] == "B" ? t[i].cyan : t[i].blue;
    }
    return result;
};

Shop.prototype.findShop = function(universe, sector) {
    for (i in universe.shops) {
        if (universe.shops[i].sector == sector) {
            return universe.shops[i];
        }
    }

    return false;
};

Shop.prototype.buySellOptions = function() {
    var options = this.types[this.type].split("");

    var fuel      = options[0];
    var organics  = options[1];
    var equipment = options[3];

    return options;
};

Shop.prototype.isBuyable = function(product) {
    var options = this.buySellOptions();

    switch (product.toLowerCase()) {
        case "fuel":      return options[0] == "B"; break;
        case "organics":  return options[1] == "B"; break;
        case "equipment": return options[2] == "B"; break;
    }

    return false;
};

Shop.prototype.isSellable = function(product) {
    var options = this.buySellOptions();

    switch (product.toLowerCase()) {
        case "fuel":      return options[0] == "S"; break;
        case "organics":  return options[1] == "S"; break;
        case "equipment": return options[2] == "S"; break;
    }

    return false;
};

module.exports = Shop;