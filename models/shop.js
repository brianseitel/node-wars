var config   = require('../config.js');

var Shop = function() {
    this.sector = null;
    this.buy    = false;
    this.sell   = false;
    this.bank   = 0;

    this.goods = [];

    this.init = function() {
        while (!this.buy && !this.sell) {
            this.buy = Math.floor(Math.random()) < 0.5;
            this.sell = Math.floor(Math.random()) < 0.5;
        }

        this.bank = Math.floor(Math.random() * config.SHOP_AVERAGE_BANKROLL) + config.SHOP_MIN_BANKROLL;

        while (this.goods.length === 0) {
            var ore     = Math.floor(Math.random()) < 0.5;
            var fuel    = Math.floor(Math.random()) < 0.5;
            var weapons = Math.floor(Math.random()) < 0.5;

            if (ore) {
                this.goods.push('ore');
            }

            if (fuel) {
                this.goods.push('fuel');
            }

            if (weapons) {
                this.goods.push('weapons');
            }
        }

        return this;
    }

    this.inventory = function() {
        return " [" + this.goods.join('] [') + "]";
    }

    this.findShop = function(universe, sector) {
        for (i in universe.shops) {
            if (universe.shops[i].sector == sector) {
                return universe.shops[i];
            }
        }

        return false;
    }
}

module.exports = Shop;