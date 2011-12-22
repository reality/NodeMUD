var net = require('net');
var vm = require('vm');

var sandboxGen = function(nmud, user) {
    var environment = {
        'say': function(text) {
            nmud.broadcast(text);        
        }
    };

    for(index in user.commands) {
        environment[index] = user.commands[index];
    }

    return environment;
};

var testUser = {
    'name': 'reality',
    'commands': {
        'test': function(a, b) {
            say(a + b);
        }
    },
    'socket': null
};

var NodeMUD = function() {
    this.connections = [];

    this.server = net.createServer(function(socket) {
        socket.write('Welcome to NodeMUD, bitches.\r\n');

        testUser.socket = socket;
        socket.user = testUser;
        this.connections.push(testUser);

        socket.on('data', function(input) {
            var sandbox = sandboxGen(this, socket.user);
            vm.runInNewContext(input, sandbox);
        }.bind(this));
    }.bind(this));

    this.server.listen(1337, "64.30.136.166");
}

NodeMUD.prototype.broadcast = function(text) {
    for(index in this.connections) {
        this.connections[index].socket.write(text + '\r\n');
    }
}

new NodeMUD();
