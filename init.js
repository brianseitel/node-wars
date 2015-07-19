var Sector   = require('./sector.js');
var Cluster  = require('./cluster.js');
var Universe = require('./universe.js');
var config   = require('./config.js');
var fs       = require('fs');
var Helper   = require('./helpers.js');
var Mapper   = require('./mapper.js');
var BigBang  = require('./bigbang.js');
var helpers = new Helper;
var maptool = new Mapper;
var singularity = new BigBang;


console.log("Initiating Big Bang...");
var universe = singularity.start();
console.log("Universe initialized!");

console.log("Building map file...");
helpers.saveMap(universe);
console.log("Saved map file!");

var success = maptool.testPaths(universe);
if (success) {
    console.log("Universe initialized successfully!");
} else {
    console.log("Big Bang failed. Universe collapsed. Try again.");
}