var assert = require("assert")
var Sector = require('../models/sector.js');
describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

describe('Sector', function() {
    describe('this.addNeighbor', function() {
        it('should add a neighbor', function() {
            var sector = new Sector(1, 'Sector 1');
            assert.equal(0, sector.neighbors.length);
            sector.addNeighbor(2);
            assert.equal(1, sector.neighbors.length);
        });
    });

});