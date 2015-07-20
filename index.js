var Sector   = require('./sector.js');
var Cluster  = require('./cluster.js');
var Universe = require('./universe.js');
var config   = require('./config.js');
var Helper   = require('./helpers.js');
var Mapper   = require('./mapper.js');
var BigBang  = require('./bigbang.js');

var helpers = new Helper;
var maptool = new Mapper;
var singularity = new BigBang;


var universe = helpers.load();

// var success = false;
// var success = maptool.testPaths(universe);
if (universe.sectors.length > 0) {
    var sector = universe.getSector(1);
    helpers.getInput(sector, universe);
} else {
    console.log("Invalid universe. Try again.");
}




