var Universe = require('./models/universe');
var Helper   = require('./helpers');
var Mapper   = require('./mapper');
var BigBang  = require('./bigbang');

var singularity = new BigBang;


console.log("Initiating Big Bang...");
var universe = singularity.start();
console.log("Universe initialized!");

console.log("Building map file...");
Helper.save(universe);
console.log("Saved map file!");

console.log("Verifying laws of physics are correct...");
var success = Mapper.testPaths(universe);
if (success) {
    console.log("Universe initialized successfully!");
} else {
    console.log("Big Bang failed. Universe collapsed. Try again.");
}