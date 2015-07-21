var Universe = require('./models/universe.js');
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
helpers.save(universe);
console.log("Saved map file!");

console.log("Verifying laws of physics are correct...");
var success = maptool.testPaths(universe);
if (success) {
    console.log("Universe initialized successfully!");
} else {
    console.log("Big Bang failed. Universe collapsed. Try again.");
}