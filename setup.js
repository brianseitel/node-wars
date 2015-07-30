var fs = require('fs');

// Set up dummy player
var player = '{"name":"George","sector":1,"level":1,"credits":137837,"ship":"Imperial Starship","holds":100,"cargo":{"fuel":0,"organics":0,"equipment":0}}';
fs.writeFile("data/player.json", player);

// Set up logs directory
var mkdirSync = function (path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
}

mkdirSync('./logs');
