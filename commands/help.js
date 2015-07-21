var fs = require('fs');

var Help = function() {
    this.messages = JSON.parse(fs.readFileSync('data/help.json', 'utf8'));
};

Help.prototype.ask = function(args) {
    if (args.length === 0) {
        var message = {
            title: "Help",
            body: "This is the help section. Choose one of the sections below and call it by typing `help <keyword>`."
        }

        var text  = "";
            text += "\n " + message.title;
            text += "\n " + Array(message.title.length + 1).join('-');
            text += "\n " + wordwrap(message.body, 80, "\n", false);
            text += "\n\n " + "Keywords:";
            text += "\n ";

        var keys = Object.keys(this.messages);
        for (i in keys) {
            if (i % 3 === 0) text += "\n ";
            text += keys[i].paddingLeft('                   ');
        }

        text += "\n";

        console.log(text);

    } else if (this.messages[args[0]]) {
        var message = this.messages[args[0]];

        var text  = "";
            text += "\n " + message.title;
            text += "\n " + Array(message.title.length + 1).join('-');
            text += "\n " + wordwrap(message.body, 80, "\n", false);
            text += "\n"; 

        console.log(text);
    }
}

function wordwrap( str, width, brk, cut ) {
 
    brk = brk || 'n';
    width = width || 75;
    cut = cut || false;
 
    if (!str) { return str; }
 
    var regex = '.{1,' +width+ '}(\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\S+?(\s|$)');
 
    return str.match( RegExp(regex, 'g') ).join( brk );
 
}
String.prototype.paddingLeft = function (paddingValue) {
   return String(this + paddingValue).slice(0, paddingValue.length);
};
module.exports = Help;