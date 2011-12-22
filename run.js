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
        connections.push(socket);
        socket.write('Welcome to NodeMUD, bitches.\r\n');

        socket.on('data', function(data) {
            vm.runInNewContext(data, sandbox);
        });
    }.bind(this));

    server.listen(1337, "64.30.136.166");
}
NodeMUD.prototype.broadcast = function(text) {
    for(index in this.connections) {
        if(this.connections[index] != socket) {
            this.connections[index].write(data);
        }
    }
}

new NodeMUD();
