var net = require('net');
var vm = require('vm');

var sandbox = function(nmud) {
    return {
        'say': function(text) {
            nmud.broadcast(text);        
        }
    };
};

var NodeMUD = function() {
    this.sandbox = sandbox(this);
    this.connections = [];

    this.server = net.createServer(function(socket) {
        this.connections.push(socket);
        socket.write('Welcome to NodeMUD, bitches.\r\n');

        socket.on('data', function(input) {
            console.log(input);
            vm.runInNewContext(input, this.sandbox);
        }.bind(this));
    }.bind(this));

    this.server.listen(1337, "64.30.136.166");
}
NodeMUD.prototype.broadcast = function(text) {
    for(index in this.connections) {
        this.connections[index].write(text);
    }
}

new NodeMUD();
