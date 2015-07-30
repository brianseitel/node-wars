var fs = require('fs');
var View = require('../core/view');
var Help = function() {
    this.messages = JSON.parse(fs.readFileSync('data/help.json', 'utf8'));
};

Help.prototype.ask = function(args) {
    if (args.length === 0) {
        var text = "";
        var keys = Object.keys(this.messages).sort(function(a, b) {
            return (a < b) ? -1 : (a > b) ? 1 : 0;
        });

        var map = [];
        var row = [];
        while (keys.length) {
            var k = keys.shift();
            row.push(k + Array(16 - k.length).join(" "));
            if (row.length === 3) {
                map.push(row);
                row = [];
            }
        }
        
        var view = new View('./views/help/default.txt');
        return view.render({keys: map});

    } else if (this.messages[args[0]]) {
        var view = new View('./views/help/entry.txt');

        var item = this.messages[args[0]];
        return view.render({
            title: item.title,
            body: item.body.replace(/(\S(.{0,78}\S)?)\s+/g, '$1\n'),
            keywords: item.keywords
        });
    }
};

String.prototype.paddingLeft = function (paddingValue, length) {
   return String(this + paddingValue).slice(0, length ? length : paddingValue.length);
};

module.exports = Help;