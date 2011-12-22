var net = require('net');
var vm = require('vm');

var sandboxGen = function(nmud, user) {
    var environment = {
        'say': function(text) {
            nmud.broadcast(text);        
        }
    };

    return environment;
};

var testUser = {
    'name': 'reality',
    'commands': {
        'test': vm.createScript('say(\'fish\');')
    },
    'socket': null
};

var NodeMUD = function() {
    this.connections = [];

    this.server = net.createServer(function(socket) {
        socket.write('Welcome to NodeMUD, bitches.\r\n');

        // Yeah multiple users is broke for now shut up
        testUser.socket = socket;
        socket.user = testUser;
        this.connections.push(testUser);

        socket.on('data', function(input) {
            var sandbox = sandboxGen(this, socket.user);
            var commandName = chomp(input.toString()).split(' ')[0];
            console.log(commandName);
            if(socket.user.commands.hasOwnProperty(commandName)) {
                vm.runInNewContext(socket.user.commands[commandName], sandbox);
            } else {
                vm.runInNewContext(input, sandbox);
            }
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

function chomp(raw_text) {
  return raw_text.replace(/(\n|\r)+$/, '');
}
