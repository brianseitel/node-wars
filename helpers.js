var prompt   = require('prompt');
var Universe = require('./universe.js');

var Helper = function() {

    this.shuffle = function(o) {
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    },

    this.onErr = function(err) {
        console.log(err);
        return 1;
    },

    this.getInput = function(sector, universe) {
        prompt.start();
        sector.neighbors.sort();
        prompt.message = "You are in " + sector.name + ". Neighbors: [" + sector.neighbors.join(", ") + "]";
        prompt.get(['input'], function(err, result) {
            if (err) { return helpers.onErr(err); }

            if (result.input == 'done') {
                console.log("Bye!");
                return 1;
            }

            if (parseInt(result.input)) {
                var input = parseInt(result.input);

                if (sector.hasNeighbor(input)) {
                    console.log("You warp to Sector " + input + " at light speed!");
                    sector = universe.getSector(input);
                } else {
                    console.log("You can't get there from here!");
                }

            } else {
                console.log("Invalid input. Try again.");
            }
             helpers.getInput(sector, universe);
        });
    }
};

var helpers = new Helper();
module.exports = Helper;