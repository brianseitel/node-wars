var Helper  = require('../helpers.js');

var helpers = new Helper;

var Outpost = function() {
    this.enter = function(args, game) {
        var shop = game.current_sector.getShop(game.universe.shops);
        if (!shop) {
            return false;
        }

        game.setState("IN_SHOP");
    };

    this.leave = function(args, game) {
        var shop = game.current_sector.getShop(game.universe.shops);
        if (!shop) {
            return false;
        }
        game.setState("SPACE");
    };

    this.buy = function(args, game) {
        var shop = game.current_sector.getShop(game.universe.shops);
        var player = game.player;

        if (args.length < 2) {
            return "You must specify item and amount. Example: buy fuel 10\n";
        }

        var item   = args[0].toLowerCase();
        var amount = parseInt(args[1], 10);
        var cost   = amount * shop.prices[item];

        if (["fuel","organics","equipment"].indexOf(item) < 0) {
            return "Please provide a valid item: fuel, organics, equipment.\n";
        }

        if (amount > shop.inventory[item]) {
            return "There is not enough " + item + " for you to buy.\n";
        }

        if (amount < 0) {
            return "Invalid amount. Please try again.\n";
        }

        if (player.credits - cost < 0) {
            return "You do not have enough credits to buy this amount.";
        }

        if (!shop.isBuyable(item)) {
            return "This product is not for sale. Try selling " + item + " to this shop, instead!\n";
        }

        player.cargo[item]   += amount;
        shop.inventory[item] -= amount;
        player.credits       -= cost;
        shop.bank            += cost;

        helpers.saveShops(game.universe);
        helpers.savePlayer(game.player);
    };

    this.sell = function(args, game) {
        var shop = game.current_sector.getShop(game.universe.shops);
        var player = game.player;

        if (args.length < 2) {
            return "You must specify item and amount. Example: sell fuel 10\n";
        }

        var item   = args[0].toLowerCase();
        var amount = parseInt(args[1], 10);
        var cost   = amount * shop.prices[item];

        if (["fuel","organics","equipment"].indexOf(item) < 0) {
            return "Please provide a valid item: fuel, organics, equipment.\n";
        }

        if (amount > player.cargo[item]) {
            return "You do not have enough " + item + " to sell.\n";
        }

        if (amount < 0) {
            return "Invalid amount. Please try again.\n";
        }

        if (shop.bank - cost < 0) {
            return "The shop cannot afford to buy this from you.";
        }

        if (!shop.isSellable(item)) {
            return "This shop has enough " + item + ". Try buying some, instead!\n";
        }
        player.cargo[item]   -= amount;
        shop.inventory[item] += amount;
        player.credits       += cost;
        shop.bank            -= cost;

        helpers.saveShops(game.universe);
        helpers.savePlayer(game.player);
    };
};

module.exports = Outpost;