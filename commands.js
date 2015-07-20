var Commands = function() {
    var actions = [];
    
    this.register = function(command, method) {
        actions[command] = method;
    }

    this.fetch = function(command) {
        var val = null;
        if (actions[command]) {
            val = actions[command];
        } else {
            console.log('crap: ' + command + ' foo');
        }

        return val;
    }

    this.help = function(args) {
        console.log("Yawp!");
        return 100;
    }
}

module.exports = Commands;