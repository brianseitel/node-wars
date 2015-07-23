var markup = require('markup-js');
var fs     = require('fs');



var View = function(path) {
    this.path = path;

    this.render = function(params) {
        var template = fs.readFileSync(this.path, 'utf8');
        markup.compact = true;
        markup.pipes.grafs = function (str) {
            return str.replace(/(.+)/g, function (s, p1) {
                return p1 + "\n";
            });
        };

        markup.pipes.pad = function(str, size) {
            return str.toString() + new Array(size - str.toString().length).join(" ");
        };

        return markup.up(template, params);
    }
};

module.exports = View;