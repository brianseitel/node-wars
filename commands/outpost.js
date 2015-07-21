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

};

module.exports = Outpost;