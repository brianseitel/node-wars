var markup = require('markup-js');
var fs     = require('fs');
var colors = require('colors');


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

        markup.pipes.colorize = function(str, color) {
            str = str.toString();

            switch(color.trim().toString()) {
                case "green":   return str.green; break;
                case "red":     return str.red; break;
                case "cyan":    return str.cyan; break;
                case "blue" :   return str.blue; break;
                case "yellow":  return str.yellow; break;
                case "white":   return str.white; break;
                case "black":   return str.black; break;
                case "magenta": return str.magenta; break;
                case "gray":    return str.gray; break;
                case "grey":    return str.grey; break;
                case "bold.white":   return str.white.bold; break;
                case "dark_cyan":    return str.cyan.dim; break;
                case "dark_green":   return str.green.dim; break;
                case "dark_red":     return str.red.dim; break;
                case "dark_blue":    return str.blue.dim; break;
                case "dark_yellow":  return str.yellow.dim; break;
                case "dark_magenta": return str.magenta.dim; break;
                case "dark_gray":    return str.gray.dim; break;
            }
        }

        return markup.up(template, params);
    }
};

module.exports = View;